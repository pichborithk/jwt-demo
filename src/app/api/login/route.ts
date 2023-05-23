import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '1m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '1d' }
  );

  await db.query(
    `
    UPDATE users
    SET "refreshToken"=$2
    WHERE id=$1
    `,
    [user.id, refreshToken]
  );

  const response = NextResponse.json({
    success: true,
    user: { username: user.username, token: accessToken },
  });

  response.cookies.set('jwt', refreshToken, {
    httpOnly: true,
    maxAge: 5 * 60,
  });

  return response;
}
