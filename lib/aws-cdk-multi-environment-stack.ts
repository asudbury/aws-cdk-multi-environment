import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

interface AwsCdkMultiEnvironmentStackProps extends StackProps {
  readonly deploymentEnv: 'dev' | 'test' | 'uat' | 'staging' | 'prod';
}

export class AwsCdkMultiEnvironmentStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: AwsCdkMultiEnvironmentStackProps
  ) {
    super(scope, id, props);

    const { deploymentEnv } = props;

    /// s3 Bucket

    const bucket = new s3.Bucket(this, 'awsCdkS3Bucket-' + deploymentEnv, {
      bucketName: 'aws-cdk-s3bucket-' + deploymentEnv,
    });

    /// Lambda Function

    const lambdaFunction = new lambda.Function(
      this,
      'HelloHandle-' + deploymentEnv,
      {
        functionName: 'HelloHandler-' + deploymentEnv,
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset('lambda'),
        handler: 'hello.handler',
        environment: {
          BUCKET: bucket.bucketName,
        },
      }
    );

    bucket.grantReadWrite(lambdaFunction);

    /// Api Gateway

    const api = new apigateway.RestApi(
      this,
      'awsCdkApiGateway-' + deploymentEnv,
      {
        restApiName: 'aws-cdk-api-gateway-' + deploymentEnv,
      }
    );

    const lambdaIntegration = new apigateway.LambdaIntegration(lambdaFunction, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });

    api.root.addMethod('GET', lambdaIntegration);

    /// SQS Queue

    const queue = new sqs.Queue(this, 'awsCdkQueue-' + deploymentEnv, {
      queueName: 'aws-cdk-queue-' + deploymentEnv,
      retentionPeriod: Duration.days(7),
      visibilityTimeout: Duration.seconds(300),
    });

    /// SNS Topic

    const topic = new sns.Topic(this, 'awsCdkTopic-' + deploymentEnv);

    /// SNS Subscription

    topic.addSubscription(new subs.SqsSubscription(queue));

    /// DynamoDB

    new dynamodb.Table(this, 'awsCdkDynamoDb-' + deploymentEnv, {
      tableName: 'aws-cdk-dynamodb',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.NUMBER },
    });
  }
}
