import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

const url = process.env.PUBLIC_SUPABASE_URL || '';
const password = process.env.SUPABASE_DB_PASSWORD || '';

if (!url || !password) {
  console.error('❌ Missing PUBLIC_SUPABASE_URL or SUPABASE_DB_PASSWORD in environment.');
  process.exit(1);
}

// Extract project ID from URL: https://<id>.supabase.co
const projectIdMatch = url.match(/https:\/\/([^.]+)\.supabase/);
if (!projectIdMatch) {
  console.error('❌ Could not parse project ID from Supabase URL:', url);
  process.exit(1);
}
const projectId = projectIdMatch[1];

// Supabase direct connection string details:
// Host: db.[project-id].supabase.co (default port is 5432 or 6543)
const connectionString = `postgresql://postgres:${encodeURIComponent(password)}@db.${projectId}.supabase.co:6543/postgres`;

console.log(`Connecting to Supabase DB for project: ${projectId}...`);

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await client.connect();
    console.log('✅ Connected successfully!');

    // Read schema.sql
    console.log('Reading schema.sql...');
    const schemaSql = fs.readFileSync(path.resolve('supabase/schema.sql'), 'utf8');

    // Read seed.sql
    console.log('Reading seed.sql...');
    const seedSql = fs.readFileSync(path.resolve('supabase/seed.sql'), 'utf8');

    console.log('Applying schema.sql to database...');
    await client.query(schemaSql);
    console.log('✅ Schema applied successfully!');

    console.log('Applying seed.sql to database...');
    await client.query(seedSql);
    console.log('✅ Seed listings added successfully!');

  } catch (err) {
    console.error('❌ Database migration failed:', err.message);
  } finally {
    await client.end();
  }
}

run();
