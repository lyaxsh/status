const { Client } = require('pg');

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;
  
  console.log('Testing database connection...');
  console.log('Connection string:', connectionString ? connectionString.substring(0, 50) + '...' : 'Not set');
  
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    return;
  }

  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000, // 10 seconds
    query_timeout: 10000
  });

  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('✅ Successfully connected to database!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database query successful:', result.rows[0]);
    
    await client.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
    
    if (error.code === 'ETIMEDOUT') {
      console.log('\n💡 This looks like an IP restriction issue.');
      console.log('Please check your Supabase dashboard:');
      console.log('1. Go to Settings → Database');
      console.log('2. Look for IP restrictions');
      console.log('3. Add your current IP to the allowed list');
      console.log('4. Or temporarily disable IP restrictions');
    }
  }
}

testConnection(); 