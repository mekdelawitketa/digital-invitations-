const { Client } = require('pg');

const connectionString = 'postgresql://postgres.onqcdokfuvidmhykqgga:MyProject123MH@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=no-verify';

console.log('🔄 Connecting to Supabase...');

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('✅ Connected successfully!');
    return client.query('SELECT version()');
  })
  .then(res => {
    console.log('✅ PostgreSQL version:', res.rows[0].version);
    client.end();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    client.end();
  });