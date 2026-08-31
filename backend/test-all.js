const { Client } = require('pg');

const formats = [
  {
    name: 'Format 1: postgres.onqcdokfuvidmhykqgga',
    url: 'postgresql://postgres.onqcdokfuvidmhykqgga:MyProject123MH@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=no-verify'
  },
  {
    name: 'Format 2: postgres (no project ID)',
    url: 'postgresql://postgres:MyProject123MH@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=no-verify'
  },
  {
    name: 'Format 3: postgres:onqcdokfuvidmhykqgga',
    url: 'postgresql://postgres:onqcdokfuvidmhykqgga@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=no-verify'
  },
  {
    name: 'Format 4: Direct DB (no pooler)',
    url: 'postgresql://postgres:MyProject123MH@db.onqcdokfuvidmhykqgga.supabase.co:5432/postgres?sslmode=no-verify'
  }
];

async function testConnection(format) {
  console.log(`\n🔍 Testing ${format.name}...`);
  
  const client = new Client({
    connectionString: format.url,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(`✅ SUCCESS! ${format.name} works!`);
    await client.end();
    return true;
  } catch (err) {
    console.log(`❌ ${format.name} failed:`, err.message);
    await client.end();
    return false;
  }
}

async function runAll() {
  console.log('🚀 Testing all connection formats...\n');
  
  for (const format of formats) {
    const success = await testConnection(format);
    if (success) {
      console.log(`\n🎉 FOUND WORKING FORMAT! Use this in your .env file:`);
      console.log(`DATABASE_URL="${format.url}"`);
      break;
    }
  }
  
  console.log('\n💡 If none worked, please check:');
  console.log('1. Your Supabase project is active (not paused)');
  console.log('2. Your password is correct');
  console.log('3. Your project region is eu-west-1');
}

runAll();