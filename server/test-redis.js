// Test script to verify Redis connection
const { createClient } = require('redis');
require('dotenv').config();

async function testRedis() {
  console.log('🧪 Testing Redis connection...');
  
  const redisUrl = process.env.REDIS_URL || process.env.REDISCLOUD_URL || 'redis://localhost:6379';
  console.log(`📡 Connecting to: ${redisUrl.replace(/\/\/.*@/, '//***:***@')}`);
  
  try {
    const client = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 10000,
      }
    });

    client.on('error', (err) => {
      console.log('❌ Redis Client Error:', err.message);
    });

    client.on('connect', () => {
      console.log('✅ Connected to Redis');
    });

    await client.connect();
    
    // Test basic operations
    await client.set('test:key', 'Hello Redis!');
    const value = await client.get('test:key');
    console.log('✅ Redis test successful:', value);
    
    await client.del('test:key');
    await client.quit();
    
    console.log('✅ Redis connection test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.log('❌ Redis connection failed:', error.message);
    console.log('ℹ️  This is normal if Redis is not running locally');
    console.log('ℹ️  The server will fall back to memory store');
    process.exit(1);
  }
}

testRedis();
