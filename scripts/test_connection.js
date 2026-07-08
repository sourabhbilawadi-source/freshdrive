import pg from 'pg';

const { Client } = pg;

const url = process.env.PUBLIC_SUPABASE_URL || '';
const password = process.env.SUPABASE_DB_PASSWORD || '';

if (!url || !password) {
  console.error('❌ Missing PUBLIC_SUPABASE_URL or SUPABASE_DB_PASSWORD in environment.');
  process.exit(1);
}

const projectIdMatch = url.match(/https:\/\/([^.]+)\.supabase/);
if (!projectIdMatch) {
  console.error('❌ Could not parse project ID from Supabase URL:', url);
  process.exit(1);
}
const projectId = projectIdMatch[1];
const connectionString = `postgresql://postgres:${encodeURIComponent(password)}@db.${projectId}.supabase.co:6543/postgres`;

console.log(`Testing read-only connection for project: ${projectId}...`);

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await client.connect();
    console.log('✅ Connection test: Success!');
    
    const res = await client.query('SELECT COUNT(*) FROM jobs;');
    console.log(`✅ Database query: Success! Current active job count in DB: ${res.rows[0].count}`);
  } catch (err) {
    console.error('❌ Connection test: Failed:', err.message);
  } finally {
    await client.end();
  }
}

run();
