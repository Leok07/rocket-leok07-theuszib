import { NextRequest, NextResponse } from 'next/server';
import { BallchasingClient } from '@/lib/ballchasing';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const playerName = searchParams.get('player-name') || undefined;
    const playerId = searchParams.get('player-id') || undefined;
    const playlist = searchParams.get('playlist') || 'ranked-doubles';
    const count = parseInt(searchParams.get('count') || '50', 10);
    const after = searchParams.get('after') || undefined;
    const before = searchParams.get('before') || undefined;

    const client = new BallchasingClient();
    const result = await client.listReplays({
      playerName,
      playerId,
      playlist,
      count,
      after,
      before,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao buscar partidas',
      },
      { status: 500 }
    );
  }
}
