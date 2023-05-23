import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

type Decoded = {
  id: number;
  username: string;
};

export function GET(request: Request) {
  const auth = request.headers.get('authorization');
  const prefix = 'Bearer ';

  if (auth?.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    const { username } = decoded as Decoded;

    return NextResponse.json({ success: true, user: { username } });
  }
}
