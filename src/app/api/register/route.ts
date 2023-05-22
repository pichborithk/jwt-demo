import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password)
    return NextResponse.json({
      success: false,
      message: 'Missing required data',
    });

  const { rows } = await db.query(
    `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `,
    [username, password]
  );

  return NextResponse.json({ success: true, user: rows });
}
