# AWS RDS MySQL Deployment Guide

## Malaysian Spotify Roasting API - Free Tier Compliant

This guide walks you through deploying AWS RDS MySQL for your Malaysian Spotify roasting API while staying strictly within AWS Free Tier limits.

## 🎯 Free Tier Specifications

Your RDS configuration is optimized for **ZERO CHARGES** within AWS Free Tier:

- **Instance**: `db.t3.micro` (750 hours/month FREE)
- **Storage**: 20 GB General Purpose SSD (FREE)
- **Engine**: MySQL 8.0.35 (latest supported)
- **Multi-AZ**: DISABLED (not included in free tier)
- **Backups**: 7 days retention (FREE)
- **Monitoring**: Basic only (FREE)

## 📋 Prerequisites

1. **AWS Account** with Free Tier eligibility
2. **AWS CLI** configured with appropriate permissions
3. **Node.js** and **Bun** installed
4. **Strong RDS password** set in `.env` file

### Required AWS Permissions

Your AWS user/role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds:*",
        "ec2:*",
        "cloudformation:*",
        "lambda:*",
        "dynamodb:*",
        "cloudwatch:*",
        "iam:*"
      ],
      "Resource": "*"
    }
  ]
}
```

## 🚀 Deployment Steps

### Step 1: Install Dependencies

```bash
cd backend
bun install
```

### Step 2: Configure Environment

Update your `.env` file with a strong password:

```env
# CRITICAL: Set a strong password for RDS MySQL
DB_PASSWORD=YourVerySecurePassword123!@#
```

**Password Requirements:**

- At least 8 characters
- Include uppercase, lowercase, numbers, and symbols
- No spaces or quotes

### Step 3: Deploy Infrastructure

Deploy the complete infrastructure (RDS + DynamoDB + Lambda):

```bash
# Full deployment with automatic database initialization
bun run deploy:full
```

**OR** deploy step by step:

```bash
# 1. Deploy infrastructure
bun run deploy:dev

# 2. Wait for RDS to be available (10-15 minutes)
# 3. Initialize database
bun run db:init
```

### Step 4: Verify Deployment

Check that everything is working:

```bash
# Monitor Free Tier usage
bun run db:monitor
```

### Step 5: Enable Database Features

Once RDS is ready, update `.env`:

```env
# Enable database features
RATE_LIMITING_ENABLED=true
ROAST_STORAGE_ENABLED=true
```

Then redeploy:

```bash
bun run deploy:dev
```

## 📊 What Gets Created

### AWS Resources

1. **RDS MySQL Instance**
   - Identifier: `roast-spotify-mysql-dev`
   - Class: `db.t3.micro`
   - Storage: 20 GB
   - Public access: Enabled (for Lambda)

2. **Security Group**
   - Name: `roast-spotify-rds-sg-dev`
   - Allows MySQL (3306) from anywhere
   - Required for Lambda outside VPC

3. **DynamoDB Table**
   - Name: `daily-roast-limits`
   - Purpose: Rate limiting (10 requests/day per IP)
   - Provisioned: 5 RCU/WCU

4. **CloudWatch Alarms**
   - RDS CPU monitoring
   - RDS connection monitoring
   - Free Tier usage alerts

### Database Schema

Three main tables are created:

1. **`roasts`** - AI-generated roasts with metadata
2. **`playlist_metadata`** - Rich playlist analysis data
3. **`roast_analytics`** - Performance and engagement tracking

## 🔍 Monitoring & Maintenance

### Free Tier Usage Monitoring

Run the monitoring script regularly:

```bash
bun run db:monitor
```

This shows:

- RDS instance hours used (750/month limit)
- Storage usage (20 GB limit)
- DynamoDB capacity consumption
- Lambda invocations and duration

### Key Metrics to Watch

| Resource        | Free Tier Limit   | Monitor          |
| --------------- | ----------------- | ---------------- |
| RDS Hours       | 750/month         | Instance uptime  |
| RDS Storage     | 20 GB             | Database size    |
| DynamoDB RCU    | 25/month          | Read operations  |
| DynamoDB WCU    | 25/month          | Write operations |
| Lambda Requests | 1M/month          | API calls        |
| Lambda Duration | 400K GB-sec/month | Execution time   |

### Cost Alerts

The deployment includes CloudWatch alarms that trigger when:

- RDS CPU usage > 80%
- RDS connections > 15
- Unusual resource consumption patterns

## 🛠️ Troubleshooting

### Common Issues

#### 1. RDS Connection Failed

**Symptoms:**

```
Error: connect ETIMEDOUT
Error: ER_ACCESS_DENIED_ERROR
```

**Solutions:**

- Check security group allows port 3306
- Verify DB_PASSWORD in .env matches RDS password
- Ensure RDS instance is in "available" state
- Check AWS region matches (ap-southeast-1)

#### 2. CloudFormation Stack Failed

**Symptoms:**

```
CREATE_FAILED: RDSInstance
```

**Solutions:**

- Check AWS Free Tier eligibility
- Verify unique DB instance identifier
- Ensure sufficient IAM permissions
- Check region capacity for db.t3.micro

#### 3. Database Initialization Failed

**Symptoms:**

```
Schema file not found
Connection timeout
```

**Solutions:**

- Run from backend directory: `cd backend && bun run db:init`
- Wait for RDS to be fully available (10-15 minutes)
- Check RDS endpoint in AWS Console
- Verify network connectivity

### Debug Commands

```bash
# Check CloudFormation stack status
aws cloudformation describe-stacks --stack-name Roast-spotify-api-dev

# Check RDS instance status
aws rds describe-db-instances --db-instance-identifier roast-spotify-mysql-dev

# Test database connection
mysql -h YOUR_RDS_ENDPOINT -u admin -p roast_spotify

# Check Lambda logs
aws logs tail /aws/lambda/Roast-spotify-api-dev-generateRoast --follow
```

## 🔒 Security Best Practices

### Network Security

- **Public RDS Access**: Required for Lambda outside VPC
- **Security Groups**: Restrict to necessary ports only
- **SSL/TLS**: Enabled for production connections
- **No VPC**: Avoids NAT Gateway costs

### Database Security

- **Strong Passwords**: Complex RDS master password
- **Encryption**: Storage encryption enabled
- **Backups**: Automated with 7-day retention
- **Monitoring**: CloudWatch alarms for unusual activity

### Application Security

- **Connection Pooling**: Prevents connection exhaustion
- **Rate Limiting**: DynamoDB-based IP throttling
- **Input Validation**: Sanitized database queries
- **Error Handling**: No sensitive data in logs

## 📈 Performance Optimization

### Connection Management

```typescript
// Singleton connection pool (already implemented)
const connectionPool = mysql.createPool({
  connectionLimit: 5, // Conservative for free tier
  acquireTimeout: 60000,
  timeout: 60000,
});
```

### Query Optimization

- **Indexed Queries**: All searches use proper indexes
- **JSON Fields**: Optimized for metadata storage
- **Pagination**: Efficient LIMIT/OFFSET queries
- **Connection Reuse**: Lambda container optimization

### Free Tier Optimization

- **Minimal Connections**: Pool size limited to 5
- **Efficient Queries**: Avoid full table scans
- **Batch Operations**: Group related database operations
- **Caching**: Consider Redis for frequently accessed data

## 🔄 Backup & Recovery

### Automated Backups

- **Retention**: 7 days (maximum free tier)
- **Window**: 03:00-04:00 SGT (low traffic)
- **Point-in-time**: Recovery available
- **Cross-region**: Not enabled (costs extra)

### Manual Backup

```bash
# Export database schema
mysqldump -h YOUR_RDS_ENDPOINT -u admin -p --no-data roast_spotify > schema-backup.sql

# Export data
mysqldump -h YOUR_RDS_ENDPOINT -u admin -p roast_spotify > data-backup.sql
```

### Disaster Recovery

1. **RDS Snapshots**: Automatic daily snapshots
2. **Schema Versioning**: Git-tracked database schema
3. **Data Export**: Regular manual exports for critical data
4. **Infrastructure as Code**: Complete CloudFormation recreation

## 🚀 Production Considerations

### Scaling Beyond Free Tier

When you outgrow free tier limits:

1. **RDS Scaling**:
   - Upgrade to `db.t3.small` or larger
   - Enable Multi-AZ for high availability
   - Increase storage as needed

2. **DynamoDB Scaling**:
   - Switch to On-Demand billing
   - Enable auto-scaling
   - Add Global Secondary Indexes

3. **Lambda Optimization**:
   - Increase memory allocation
   - Enable provisioned concurrency
   - Implement caching layers

### Monitoring & Alerting

- **CloudWatch Dashboards**: Custom metrics visualization
- **SNS Notifications**: Email/SMS alerts for issues
- **AWS X-Ray**: Distributed tracing for performance
- **Custom Metrics**: Application-specific monitoring

## 📞 Support & Resources

### Documentation Links

- [AWS RDS Free Tier](https://aws.amazon.com/rds/free/)
- [MySQL 8.0 Documentation](https://dev.mysql.com/doc/refman/8.0/en/)
- [Serverless Framework](https://www.serverless.com/framework/docs/)

### Useful Commands

```bash
# Quick status check
bun run db:monitor

# Reinitialize database
bun run db:init

# Full redeployment
bun run deploy:full

# Local development
bun run dev
```

### Getting Help

1. **Check CloudWatch Logs**: Lambda and RDS logs
2. **AWS Support**: Free tier includes basic support
3. **Community Forums**: Serverless Framework community
4. **Documentation**: This guide and AWS docs

---

## ✅ Deployment Checklist

- [ ] AWS CLI configured with proper permissions
- [ ] Strong password set in `.env` file
- [ ] Dependencies installed (`bun install`)
- [ ] Infrastructure deployed (`bun run deploy:dev`)
- [ ] RDS instance available (check AWS Console)
- [ ] Database initialized (`bun run db:init`)
- [ ] Database features enabled in `.env`
- [ ] Application redeployed with database enabled
- [ ] Free Tier monitoring set up (`bun run db:monitor`)
- [ ] API endpoints tested
- [ ] CloudWatch alarms configured

**🎉 Your Malaysian Spotify Roasting API with AWS RDS MySQL is now ready!**

The system is configured to stay within AWS Free Tier limits while providing a robust, scalable database solution for your roasting API.
