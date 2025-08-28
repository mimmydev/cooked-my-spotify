import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDocClient, RATE_LIMIT_TABLE, handleDynamoError } from './dynamoClient.js';
import type { IRateLimitResult, IRateLimitEntry } from '../../types/index.js';

export class RateLimitService {
  private readonly isEnabled: boolean;
  private readonly dailyLimit: number;

  constructor() {
    // Environment-based configuration
    this.isEnabled = process.env.RATE_LIMITING_ENABLED === 'true';
    this.dailyLimit = parseInt(process.env.RATE_LIMIT_PER_DAY || '10', 10);

    console.log(
      `🔧 Rate Limiting Service: ${this.isEnabled ? 'ENABLED' : 'DISABLED'} (Limit: ${this.dailyLimit}/day)`
    );
  }

  /**
   * Check if client IP has exceeded daily rate limit
   * @param clientIp - Client IP address
   * @returns Promise<IRateLimitResult> - allowed status and remaining count
   */
  async checkDailyLimit(clientIp: string): Promise<IRateLimitResult> {
    // Development mode bypass
    if (!this.isEnabled) {
      console.log('🔧 Dev mode: Bypassing rate limit check');
      return { allowed: true, remaining: 999 };
    }

    try {
      return await this.checkActualLimit(clientIp);
    } catch (error: any) {
      console.error('Rate limit check failed:', error);

      // Graceful fallback - allow request but log error
      console.log('⚠️ Rate limiting failed, allowing request as fallback');
      return { allowed: true, remaining: this.dailyLimit };
    }
  }

  /**
   * Increment usage count for client IP
   * @param clientIp - Client IP address
   */
  async incrementUsage(clientIp: string): Promise<void> {
    // Development mode bypass
    if (!this.isEnabled) {
      console.log('🔧 Dev mode: Bypassing usage increment');
      return;
    }

    try {
      const now = Date.now();
      const expirationTime = now + 24 * 60 * 60 * 1000; // 24 hours from now

      const entry: IRateLimitEntry = {
        ip_address: clientIp,
        request_timestamp: now,
        expiration_time: expirationTime,
      };

      const command = new PutCommand({
        TableName: RATE_LIMIT_TABLE,
        Item: entry,
      });

      await dynamoDocClient.send(command);
      console.log(`✅ Rate limit usage incremented for IP: ${clientIp}`);
    } catch (error: any) {
      console.error('Failed to increment usage:', error);
      // Don't throw - this is non-critical for user experience
    }
  }

  /**
   * Private helper to check actual rate limit using DynamoDB
   * @param clientIp - Client IP address
   * @returns Promise<IRateLimitResult>
   */
  private async checkActualLimit(clientIp: string): Promise<IRateLimitResult> {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

    // Query all requests for this IP in the last 24 hours
    const command = new QueryCommand({
      TableName: RATE_LIMIT_TABLE,
      KeyConditionExpression: 'ip_address = :ip AND request_timestamp > :timestamp',
      ExpressionAttributeValues: {
        ':ip': clientIp,
        ':timestamp': twentyFourHoursAgo,
      },
    });

    const result = await dynamoDocClient.send(command);
    const requestCount = result.Items?.length || 0;

    const allowed = requestCount < this.dailyLimit;
    const remaining = Math.max(0, this.dailyLimit - requestCount);

    console.log(
      `📊 Rate limit check for ${clientIp}: ${requestCount}/${this.dailyLimit} requests (${remaining} remaining)`
    );

    return { allowed, remaining };
  }
}
