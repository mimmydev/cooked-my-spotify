import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client for ap-southeast-1 region
const dynamoClient = new DynamoDBClient({
  region: 'ap-southeast-1',
});

// Create Document Client for easier operations
const docClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: {
    convertEmptyValues: false,
    removeUndefinedValues: true,
    convertClassInstanceToMap: false,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

// Export the document client for use in services
export { docClient as dynamoDocClient };

// Export table name constant
export const RATE_LIMIT_TABLE = 'daily-roast-limits';

// Helper function to handle DynamoDB errors
export function handleDynamoError(error: any): string {
  console.error('DynamoDB Error:', error);

  if (error.name === 'ResourceNotFoundException') {
    return 'Rate limiting table not found';
  }

  if (error.name === 'ProvisionedThroughputExceededException') {
    return 'Rate limiting service temporarily unavailable';
  }

  if (error.name === 'ValidationException') {
    return 'Invalid rate limiting request';
  }

  return 'Rate limiting service error';
}
