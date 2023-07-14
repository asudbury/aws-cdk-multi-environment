import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayEventRequestContext, APIGatewayProxyResult } from 'aws-lambda';

/**
 * Lambda function handler for API Gateway events.
 *
 * @param  {APIGatewayProxyEvent} event Event data passed from the API Gateway
 * @param  {APIGatewayEventRequestContext} context Context data passed from the API Gateway
 * @returns {Promise<APIGatewayProxyResult>} The response object returned by the Lambda function.
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext): Promise<APIGatewayProxyResult> {

  try {
    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Hello, world!' }),
    };
    return response;
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
