import { NextRequest, NextResponse } from 'next/server';
import { BallchasingClient } from '@/lib/ballchasing';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const replayId = params.id;
    if (!replayId) {
      return NextResponse.json(
        { success: false, error: 'ID do replay nao informado' },
        { status: 400 }
      );
    }

    const client = new BallchasingClient();
    const replay = await client.getReplay(replayId);

    return NextResponse.json({
      success: true,
      data: replay,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao buscar dados do replay',
      },
      { status: 500 }
    );
  }
}
