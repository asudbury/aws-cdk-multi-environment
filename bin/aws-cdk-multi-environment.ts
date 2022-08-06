#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsCdkMultiEnvironmentStack } from '../lib/aws-cdk-multi-environment-stack';

const app = new cdk.App();

new AwsCdkMultiEnvironmentStack(app, 'dev', {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
  deploymentEnv: 'dev',
});

new AwsCdkMultiEnvironmentStack(app, 'test', {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
  deploymentEnv: 'test',
});

new AwsCdkMultiEnvironmentStack(app, 'uat', {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
  deploymentEnv: 'uat',
});

new AwsCdkMultiEnvironmentStack(app, 'staging', {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
  deploymentEnv: 'staging',
});

new AwsCdkMultiEnvironmentStack(app, 'prod', {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
  deploymentEnv: 'prod',
});
