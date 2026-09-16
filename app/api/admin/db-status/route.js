import { NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rawUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
  let maskedUrl = 'NOT_SET';
  if (rawUrl) {
    try {
      const u = new URL(rawUrl);
      maskedUrl = `${u.protocol}//${u.username}:****@${u.host}${u.pathname}`;
    } catch {
      maskedUrl = rawUrl.substring(0, 15) + '...';
    }
  }

  const p = getPool();
  let connectError = null;
  let tables = [];
  let rowCounts = {};

  if (p) {
    try {
      const client = await p.connect();
      try {
        const resTables = await client.query(`
          SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
        `);
        tables = resTables.rows.map(r => r.table_name);

        for (const t of tables) {
          try {
            const countRes = await client.query(`SELECT COUNT(*) FROM "${t}"`);
            rowCounts[t] = parseInt(countRes.rows[0].count);
          } catch (e) {
            rowCounts[t] = e.message;
          }
        }
      } finally {
        client.release();
      }
    } catch (err) {
      connectError = {
        message: err.message,
        code: err.code,
        name: err.name,
      };
    }
  }

  const availableKeys = Object.keys(process.env).filter(k => 
    !k.toLowerCase().includes('secret') && 
    !k.toLowerCase().includes('pass') && 
    !k.toLowerCase().includes('token') &&
    !k.toLowerCase().includes('key')
  );

  return NextResponse.json({
    hasPostgresUrl: Boolean(rawUrl),
    maskedUrl,
    hasPool: Boolean(p),
    connectError,
    tables,
    rowCounts,
    availableKeys,
    isServerless: Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME),
  });
}
