import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

type Decoded = {
  id: number;
  username: string;
};

export async function GET(request: NextRequest) {
  const refreshToken = request.cookies.get('jwt')?.value;

  if (!refreshToken) {
    return new NextResponse(JSON.stringify({ message: 'Missing Cookie' }), {
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const {
    rows: [user],
  } = await db.query(
    `
    SELECT id, username
    FROM users
    WHERE "refreshToken"=$1
    `,
    [refreshToken]
  );

  if (!user) {
    return new NextResponse(
      JSON.stringify({ message: 'User does not exist' }),
      {
        status: 403,
        statusText: 'Forbidden',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

  const { username } = decoded as Decoded;
  if (user.username !== username) {
    return new NextResponse(
      JSON.stringify({ message: 'User does not exist' }),
      {
        status: 403,
        statusText: 'Forbidden',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '5m' }
  );

  return NextResponse.json({
    success: true,
    user: { username: user.username, token: accessToken },
  });
}
