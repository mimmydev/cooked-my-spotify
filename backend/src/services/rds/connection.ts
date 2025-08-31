import mysql from 'mysql2/promise';

// Singleton connection pool for Lambda container reuse
let connectionPool: mysql.Pool | null = null;

/**
 * Create or return existing MySQL connection pool
 * Uses singleton pattern for efficient Lambda container reuse
 */
export async function createConnection(): Promise<mysql.Pool> {
  if (connectionPool) {
    console.log('♻️ Reusing existing MySQL connection pool');
    return connectionPool;
  }

  try {
    console.log('🔗 Creating new MySQL connection pool...');

    const poolConfig: any = {
      host: process.env.RDS_HOST || 'localhost',
      user: process.env.RDS_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.RDS_DATABASE || 'roast_spotify',
      port: parseInt(process.env.RDS_PORT || '3306', 10),
      connectionLimit: 5, // Conservative limit for free tier
    };

    // Add SSL only in production
    if (process.env.NODE_ENV === 'production') {
      poolConfig.ssl = { rejectUnauthorized: false };
    }

    connectionPool = mysql.createPool(poolConfig);

    // Test the connection
    const connection = await connectionPool.getConnection();
    await connection.ping();
    connection.release();

    console.log('✅ MySQL connection pool created successfully');
    return connectionPool;
  } catch (error: any) {
    console.error('❌ Failed to create MySQL connection:', error);

    // Reset pool on failure
    connectionPool = null;

    // Implement exponential backoff for retries
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.log('🔄 Connection refused/timeout - will retry on next request');
      throw new Error('Database temporarily unavailable');
    }

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      throw new Error('Database authentication failed');
    }

    throw new Error(`Database connection failed: ${error.message}`);
  }
}

/**
 * Execute a query with automatic retry logic
 * @param query - SQL query string
 * @param params - Query parameters
 * @returns Promise<any> - Query result
 */
export async function executeQuery(query: string, params: any[] = []): Promise<any> {
  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const pool = await createConnection();
      const [results] = await pool.execute(query, params);
      return results;
    } catch (error: any) {
      lastError = error;
      console.error(`Query attempt ${attempt}/${maxRetries} failed:`, error.message);

      // Don't retry on syntax errors or constraint violations
      if (error.code === 'ER_PARSE_ERROR' || error.code === 'ER_DUP_ENTRY') {
        throw error;
      }

      // Exponential backoff for retries
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Reset connection pool on connection errors
        if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
          connectionPool = null;
        }
      }
    }
  }

  throw lastError;
}

/**
 * Close the connection pool (for cleanup)
 */
export async function closeConnection(): Promise<void> {
  if (connectionPool) {
    console.log('🔌 Closing MySQL connection pool...');
    await connectionPool.end();
    connectionPool = null;
    console.log('✅ MySQL connection pool closed');
  }
}

/**
 * Health check for database connection
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await executeQuery('SELECT 1 as health');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
