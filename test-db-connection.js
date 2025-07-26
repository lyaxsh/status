const { Client } = require('pg');

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;
  
  console.log('Testing database connection...');
  console.log('Connection string:', connectionString ? connectionString.substring(0, 50) + '...' : 'Not set');
  
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    return;
  }

  // Try different connection configurations for Session Pooler
  const configs = [
    {
      name: 'Session Pooler with SSL',
      connectionString: connectionString + '?sslmode=require',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000
    },
    {
      name: 'Session Pooler without SSL',
      connectionString: connectionString + '?sslmode=disable',
      ssl: false,
      connectionTimeoutMillis: 15000
    },
    {
      name: 'Session Pooler default',
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000
    }
  ];

  for (const config of configs) {
    console.log(`\n🔍 Trying ${config.name}...`);
    
    const client = new Client({
      connectionString: config.connectionString,
      ssl: config.ssl,
      connectionTimeoutMillis: config.connectionTimeoutMillis
    });

    try {
      await client.connect();
      console.log(`✅ Successfully connected using ${config.name}!`);
      
      // Test a simple query
      const result = await client.query('SELECT NOW()');
      console.log('✅ Database query successful:', result.rows[0]);
      
      await client.end();
      return; // Success, exit
    } catch (error) {
      console.error(`❌ ${config.name} failed:`, error.message);
      await client.end();
    }
  }
  
  console.log('\n💡 All connection attempts failed.');
  console.log('This might be due to:');
  console.log('1. Incorrect Session Pooler URL');
  console.log('2. Wrong credentials');
  console.log('3. Network restrictions');
  console.log('\n💡 Alternative: Deploy to Vercel and let it handle the database connection');
}

testConnection(); 