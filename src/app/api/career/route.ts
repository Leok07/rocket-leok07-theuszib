import { NextRequest, NextResponse } from 'next/server';
import { fetchPlayerBallchasingCareerStats } from '@/lib/ballchasing-career';
import { fetchRapidApi2v2Rank } from '@/lib/rapidapi-rank';
import { PLAYER_1, PLAYER_2 } from '@/lib/constants';
import { CareerComparisonData } from '@/types/career';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';

    const [p1Career, p2Career, p1Rank, p2Rank] = await Promise.all([
      fetchPlayerBallchasingCareerStats(PLAYER_1.name, PLAYER_1.platform, PLAYER_1.platformLabel, forceRefresh),
      fetchPlayerBallchasingCareerStats(PLAYER_2.name, PLAYER_2.platform, PLAYER_2.platformLabel, forceRefresh),
      fetchRapidApi2v2Rank(PLAYER_1.name, PLAYER_1.platform, forceRefresh),
      fetchRapidApi2v2Rank(PLAYER_2.name, PLAYER_2.platform, forceRefresh),
    ]);

    if (p1Rank) {
      p1Career.rank2v2 = p1Rank;
    }
    if (p2Rank) {
      p2Career.rank2v2 = p2Rank;
    }

    const apiStatus = p1Career.apiStatus || p2Career.apiStatus || 'CONNECTED';
    const apiMessage = p1Career.apiMessage || p2Career.apiMessage || 'Sincronizado';

    const data: CareerComparisonData = {
      player1: p1Career,
      player2: p2Career,
      comparison: {
        goalsLeader: p1Career.goals > p2Career.goals ? 'p1' : p2Career.goals > p1Career.goals ? 'p2' : 'tie',
        savesLeader: p1Career.saves > p2Career.saves ? 'p1' : p2Career.saves > p1Career.saves ? 'p2' : 'tie',
        winRateLeader: p1Career.winRate > p2Career.winRate ? 'p1' : p2Career.winRate > p1Career.winRate ? 'p2' : 'tie',
        mvpRateLeader: p1Career.mvpRate > p2Career.mvpRate ? 'p1' : p2Career.mvpRate > p1Career.mvpRate ? 'p2' : 'tie',
      },
      apiStatus,
      apiMessage,
      lastSynced: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Erro na rota /api/career:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Falha ao buscar estatisticas de carreira',
      },
      { status: 500 }
    );
  }
}
