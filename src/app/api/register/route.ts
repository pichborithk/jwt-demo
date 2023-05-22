import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password)
    return NextResponse.json({
      success: false,
      message: 'Missing required data',
    });

  const salt = await bcrypt.genSalt(Number(process.env.SALT));

  const hash = await bcrypt.hash(password, salt);

  const { rows } = await db.query(
    `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `,
    [username, hash]
  );

  return NextResponse.json({ success: true, user: rows });
}
