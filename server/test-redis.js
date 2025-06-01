// Test script to verify Redis connection
const { createClient } = require('redis');
require('dotenv').config();

async function testRedis() {
  console.log('🧪 Testing Redis connection...');

  const redisUrl = process.env.REDIS_URL || process.env.REDISCLOUD_URL || 'redis://localhost:6379';
  console.log(`📡 Connecting to: ${redisUrl.replace(/\/\/.*@/, '//***:***@')}`);
  console.log(`📡 Full URL (masked): ${redisUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);

  try {
    const client = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 15000,
        reconnectStrategy: false, // Disable reconnection for testing
      }
    });

    client.on('error', (err) => {
      console.log('❌ Redis Client Error:', err.message);
    });

    client.on('connect', () => {
      console.log('✅ Connected to Redis');
    });

    console.log('🔗 Attempting connection...');
    await client.connect();

    console.log('🏓 Testing ping...');
    const pingResult = await client.ping();
    console.log('✅ Ping result:', pingResult);

    // Test basic operations
    console.log('📝 Testing set/get operations...');
    await client.set('test:key', 'Hello Upstash Redis!');
    const value = await client.get('test:key');
    console.log('✅ Redis test successful:', value);

    await client.del('test:key');
    console.log('🧹 Cleanup completed');

    await client.quit();
    console.log('✅ Redis connection test completed successfully!');
    process.exit(0);

  } catch (error) {
    console.log('❌ Redis connection failed:', error.message);
    console.log('❌ Error details:', error);

    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('💡 Possible issues:');
      console.log('   - Check if REDIS_URL is correct');
      console.log('   - Verify Redis service is running');
      console.log('   - Check network connectivity');
    }

    process.exit(1);
  }
}

testRedis();
