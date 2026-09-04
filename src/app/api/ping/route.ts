import { NextResponse } from 'next/server';
import { BallchasingClient } from '@/lib/ballchasing';

export async function GET() {
  try {
    const client = new BallchasingClient();
    const result = await client.ping();
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Falha ao validar chave com Ballchasing',
      },
      { status: 500 }
    );
  }
}
