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

  const { rows } = await db.query(
    `
    SELECT *
    FROM users
    WHERE username=$1;
    `,
    [username]
  );

  const [user] = rows;

  const isValidated = await bcrypt.compare(password, user.password);

  if (!user && !isValidated) {
    return NextResponse.json({
      success: false,
      message: 'Username or password is incorrect',
    });
  }

  return NextResponse.json({ success: true, user });
}
