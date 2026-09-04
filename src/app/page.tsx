'use client';

import React, { useEffect, useState } from 'react';
import { CompareHeader } from '@/components/CompareHeader';
import { CompareSection } from '@/components/CompareSection';
import { SharedMatchesList } from '@/components/SharedMatchesList';
import { FutCardsSection } from '@/components/FutCardsSection';
import { PlaystyleRadar } from '@/components/dashboard/PlaystyleRadar';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { CareerStatsBox } from '@/components/dashboard/CareerStatsBox';
import { RecentFormStreak } from '@/components/dashboard/RecentFormStreak';
import { MatchHighlights } from '@/components/dashboard/MatchHighlights';
import { MvpComparisonCard } from '@/components/dashboard/MvpComparisonCard';
import { TeamContributionChart } from '@/components/dashboard/TeamContributionChart';
import { RLRatingBox } from '@/components/dashboard/RLRatingBox';
import { RankEvolutionChart } from '@/components/dashboard/RankEvolutionChart';
import { Skeleton } from '@/components/ui/Skeleton';
import { createEmptyDashboard } from '@/lib/stats-calculator';
import { PLAYER_1, PLAYER_2 } from '@/lib/constants';
import { AggregatedPlayerDashboard, SharedMatchItem } from '@/types/dashboard';
import { CareerComparisonData } from '@/types/career';
import { formatPercentage, formatNumber } from '@/lib/utils';
import {
  Trophy,
  Zap,
  Compass,
  Gauge,
  Swords,
  Layers,
  AlertCircle,
} from 'lucide-react';

export default function Home() {
  const [player1, setPlayer1] = useState<AggregatedPlayerDashboard>(() =>
    createEmptyDashboard(PLAYER_1.name, PLAYER_1.platform, PLAYER_1.platformId)
  );
  const [player2, setPlayer2] = useState<AggregatedPlayerDashboard>(() =>
    createEmptyDashboard(PLAYER_2.name, PLAYER_2.platform, PLAYER_2.platformId)
  );
  const [sharedMatches, setSharedMatches] = useState<SharedMatchItem[]>([]);
  const [careerData, setCareerData] = useState<CareerComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCareer, setIsLoadingCareer] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchComparisonData = async (forceRefresh = false) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const url = forceRefresh ? '/api/compare?refresh=true' : '/api/compare';
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Erro na comunicacao com o servidor (${res.status})`);
      }
      const result = await res.json();
      if (result.success && result.data) {
        setPlayer1(result.data.player1);
        setPlayer2(result.data.player2);
        if (result.data.sharedMatches) {
          setSharedMatches(result.data.sharedMatches);
        }
        setLastUpdated(
          new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }).format(new Date())
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao sincronizar dados recentes.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCareerData = async (forceRefresh = false) => {
    setIsLoadingCareer(true);
    try {
      const url = forceRefresh ? '/api/career?refresh=true' : '/api/career';
      const res = await fetch(url);
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setCareerData(result.data);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar dados de carreira:', err);
    } finally {
      setIsLoadingCareer(false);
    }
  };

  useEffect(() => {
    fetchComparisonData();
    fetchCareerData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-white">
      {/* Accessible h1 for WCAG compliance */}
      <h1 className="sr-only">Tracker Rocket - Estatisticas e Comparativo 2v2</h1>

      {/* Desktop Widescreen Header */}
      <CompareHeader
        onRefresh={() => {
          fetchComparisonData(true);
          fetchCareerData(true);
        }}
        isLoading={isLoading}
        p1Matches={player1.session.totalMatches}
        p2Matches={player2.session.totalMatches}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Error notification banner if sync fails */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white font-bold text-xs"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Top Summary Banner - Desktop Optimized */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#11131a] border border-[#232736] flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-950/70 border border-sky-800/60 text-sky-400 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-zinc-100 block">
                Partidas Jogadas em Conjunto (Sessao 2v2)
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                {lastUpdated ? `Sincronizado as ${lastUpdated}` : 'Conectando ao Ballchasing...'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm font-semibold w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#232736]/60 pt-3 md:pt-0">
            <div className="text-left md:text-right">
              <span className="text-sky-400 font-bold block text-base">{player1.playerName}</span>
              <span className="text-zinc-300 text-xs">
                {player1.session.totalMatches} jogos ({player1.session.wins}V - {player1.session.losses}D)
              </span>
            </div>

            <div className="h-8 w-px bg-zinc-800 hidden md:block" />

            <div className="text-right">
              <span className="text-orange-400 font-bold block text-base">{player2.playerName}</span>
              <span className="text-zinc-300 text-xs">
                {player2.session.totalMatches} jogos ({player2.session.wins}V - {player2.session.losses}D)
              </span>
            </div>
          </div>
        </div>

        {/* Recent Form & Highlights Grid for Desktop PC */}
        {sharedMatches.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RecentFormStreak matches={sharedMatches} />
            </div>
            <div className="lg:col-span-2">
              <MatchHighlights
                matches={sharedMatches}
                player1Name={player1.playerName}
                player2Name={player2.playerName}
              />
            </div>
          </div>
        )}

        {/* Chronological Match History */}
        <SharedMatchesList matches={sharedMatches} />

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#11131a] border border-[#232736] space-y-4">
              <Skeleton className="h-7 w-64 rounded-md" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-80 w-full rounded-2xl bg-[#11131a] border border-[#232736]" />
              <Skeleton className="h-80 w-full rounded-2xl bg-[#11131a] border border-[#232736]" />
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            {/* RLRating 3.0 Indice Composto de Performance */}
            <RLRatingBox player1={player1} player2={player2} />

            {/* 0. Carreira Historica & Estatisticas Vitalicias (Ballchasing Desktop Widescreen) */}
            <CareerStatsBox
              careerData={careerData}
              player1Dashboard={player1}
              player2Dashboard={player2}
              isLoading={isLoadingCareer}
            />

            {/* Evolucao de Ranking e MMR (2v2) */}
            <RankEvolutionChart
              careerData={careerData}
              matches={sharedMatches}
              player1Name={player1.playerName}
              player2Name={player2.playerName}
            />

            {/* Desktop 2-Column Grid: Resumo Geral & MVP Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Resumo Geral de Partidas */}
              <CompareSection
                title="Resumo Geral de Partidas"
                icon={Trophy}
                iconColor="text-emerald-400"
                badgeText="Desempenho Core"
                metrics={[
                  {
                    label: 'Total de Partidas',
                    p1Value: player1.session.totalMatches,
                    p2Value: player2.session.totalMatches,
                    p1Formatted: `${player1.session.totalMatches} jogos`,
                    p2Formatted: `${player2.session.totalMatches} jogos`,
                    higherIsBetter: true,
                  },
                  {
                    label: 'Taxa de Vitoria',
                    p1Value: player1.session.winRate,
                    p2Value: player2.session.winRate,
                    p1Formatted: formatPercentage(player1.session.winRate),
                    p2Formatted: formatPercentage(player2.session.winRate),
                    higherIsBetter: true,
                  },
                  {
                    label: 'Total de Vitorias',
                    p1Value: player1.session.wins,
                    p2Value: player2.session.wins,
                    p1Formatted: `${player1.session.wins}V (${player1.session.losses}D)`,
                    p2Formatted: `${player2.session.wins}V (${player2.session.losses}D)`,
                    higherIsBetter: true,
                  },
                  {
                    label: 'Gols / Jogo',
                    p1Value: player1.session.goalsPerMatch,
                    p2Value: player2.session.goalsPerMatch,
                    p1Formatted: formatNumber(player1.session.goalsPerMatch, 2),
                    p2Formatted: formatNumber(player2.session.goalsPerMatch, 2),
                    higherIsBetter: true,
                  },
                  {
                    label: 'Saves / Jogo',
                    p1Value: player1.session.savesPerMatch,
                    p2Value: player2.session.savesPerMatch,
                    p1Formatted: formatNumber(player1.session.savesPerMatch, 2),
                    p2Formatted: formatNumber(player2.session.savesPerMatch, 2),
                    higherIsBetter: true,
                  },
                  {
                    label: 'Assists / Jogo',
                    p1Value: player1.session.assistsPerMatch,
                    p2Value: player2.session.assistsPerMatch,
                    p1Formatted: formatNumber(player1.session.assistsPerMatch, 2),
                    p2Formatted: formatNumber(player2.session.assistsPerMatch, 2),
                    higherIsBetter: true,
                  },
                  {
                    label: 'Chutes / Jogo',
                    p1Value: player1.session.shotsPerMatch,
                    p2Value: player2.session.shotsPerMatch,
                    p1Formatted: formatNumber(player1.session.shotsPerMatch, 2),
                    p2Formatted: formatNumber(player2.session.shotsPerMatch, 2),
                    higherIsBetter: true,
                  },
                  {
                    label: 'Precisao de Chute',
                    p1Value: player1.session.shootingPercentage,
                    p2Value: player2.session.shootingPercentage,
                    p1Formatted: formatPercentage(player1.session.shootingPercentage),
                    p2Formatted: formatPercentage(player2.session.shootingPercentage),
                    higherIsBetter: true,
                  },
                  {
                    label: 'Pontuacao Media',
                    p1Value: player1.session.avgScore,
                    p2Value: player2.session.avgScore,
                    p1Formatted: formatNumber(player1.session.avgScore, 0),
                    p2Formatted: formatNumber(player2.session.avgScore, 0),
                    higherIsBetter: true,
                  },
                  {
                    label: 'Total de MVPs',
                    p1Value: player1.session.mvpCount,
                    p2Value: player2.session.mvpCount,
                    p1Formatted: `${player1.session.mvpCount}`,
                    p2Formatted: `${player2.session.mvpCount}`,
                    higherIsBetter: true,
                  },
                ]}
              />

              {/* Impacto Individual & Comparativo de MVPs */}
              <div className="space-y-6">
                <MvpComparisonCard player1={player1} player2={player2} />

                {/* Radar de Estilo de Jogo */}
                <PlaystyleRadar
                  radar1={player1.radar}
                  radar2={player2.radar}
                  player1Name={player1.playerName}
                  player2Name={player2.playerName}
                />
              </div>
            </div>

            {/* Desktop 2-Column Grid: Boost & Posicionamento */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Gestao e Economia de Boost */}
              <CompareSection
                title="Gestao & Economia de Boost"
                icon={Zap}
                iconColor="text-amber-400"
                badgeText="Controle de Energia"
                metrics={[
                  {
                    label: 'Boost Por Minuto (BPM)',
                    p1Value: player1.boost.avgBpm,
                    p2Value: player2.boost.avgBpm,
                    p1Formatted: formatNumber(player1.boost.avgBpm, 0),
                    p2Formatted: formatNumber(player2.boost.avgBpm, 0),
                    higherIsBetter: true,
                  },
                  {
                    label: 'Boost Coletado / Min (BCPM)',
                    p1Value: player1.boost.avgBcpm,
                    p2Value: player2.boost.avgBcpm,
                    p1Formatted: formatNumber(player1.boost.avgBcpm, 0),
                    p2Formatted: formatNumber(player2.boost.avgBcpm, 0),
                    higherIsBetter: true,
                  },
                  {
                    label: 'Boost Medio no Tanque',
                    p1Value: player1.boost.avgAmount,
                    p2Value: player2.boost.avgAmount,
                    p1Formatted: formatPercentage(player1.boost.avgAmount),
                    p2Formatted: formatPercentage(player2.boost.avgAmount),
                    higherIsBetter: true,
                  },
                  {
                    label: 'Roubo de Pads 100 / Jogo',
                    p1Value: player1.boost.avgStolenBig,
                    p2Value: player2.boost.avgStolenBig,
                    p1Formatted: formatNumber(player1.boost.avgStolenBig, 1),
                    p2Formatted: formatNumber(player2.boost.avgStolenBig, 1),
                    higherIsBetter: true,
                  },
                  {
                    label: 'Roubo de Pads Pequenos / Jogo',
                    p1Value: player1.boost.avgStolenSmall,
                    p2Value: player2.boost.avgStolenSmall,
                    p1Formatted: formatNumber(player1.boost.avgStolenSmall, 1),
                    p2Formatted: formatNumber(player2.boost.avgStolenSmall, 1),
                    higherIsBetter: true,
                  },
                  {
                    label: 'Desperdicio Supersonico',
                    p1Value: player1.boost.avgSupersonicWaste,
                    p2Value: player2.boost.avgSupersonicWaste,
                    p1Formatted: formatNumber(player1.boost.avgSupersonicWaste, 0),
                    p2Formatted: formatNumber(player2.boost.avgSupersonicWaste, 0),
                    higherIsBetter: false,
                  },
                  {
                    label: 'Tempo c/ 0% de Boost',
                    p1Value: player1.boost.avgZeroBoostPercent,
                    p2Value: player2.boost.avgZeroBoostPercent,
                    p1Formatted: formatPercentage(player1.boost.avgZeroBoostPercent),
                    p2Formatted: formatPercentage(player2.boost.avgZeroBoostPercent),
                    higherIsBetter: false,
                  },
                  {
                    label: 'Tempo c/ 100% de Boost',
                    p1Value: player1.boost.avgFullBoostPercent,
                    p2Value: player2.boost.avgFullBoostPercent,
                    p1Formatted: formatPercentage(player1.boost.avgFullBoostPercent),
                    p2Formatted: formatPercentage(player2.boost.avgFullBoostPercent),
                    higherIsBetter: true,
                  },
                  {
                    label: 'Overfill Medio de Boost',
                    p1Value: player1.boost.avgOverfill,
                    p2Value: player2.boost.avgOverfill,
                    p1Formatted: formatNumber(player1.boost.avgOverfill, 0),
                    p2Formatted: formatNumber(player2.boost.avgOverfill, 0),
                    higherIsBetter: false,
                  },
                  {
                    label: 'Pads Grandes Coletados / Jogo',
                    p1Value: player1.boost.avgCollectedBig,
                    p2Value: player2.boost.avgCollectedBig,
                    p1Formatted: formatNumber(player1.boost.avgCollectedBig, 1),
                    p2Formatted: formatNumber(player2.boost.avgCollectedBig, 1),
                    higherIsBetter: true,
                  },
                ]}
              />

              {/* Posicionamento & Rotacao (2v2) */}
              <CompareSection
                title="Posicionamento & Rotacao (2v2)"
                icon={Compass}
                iconColor="text-cyan-400"
                badgeText="Espacial"
                metrics={[
                  {
                    label: '% Terco Defensivo',
                    p1Value: player1.positioning.avgDefensiveThird,
                    p2Value: player2.positioning.avgDefensiveThird,
                    p1Formatted: formatPercentage(player1.positioning.avgDefensiveThird),
                    p2Formatted: formatPercentage(player2.positioning.avgDefensiveThird),
                    higherIsBetter: true,
                  },
                  {
                    label: '% Terco Ofensivo',
                    p1Value: player1.positioning.avgOffensiveThird,
                    p2Value: player2.positioning.avgOffensiveThird,
                    p1Formatted: formatPercentage(player1.positioning.avgOffensiveThird),
                    p2Formatted: formatPercentage(player2.positioning.avgOffensiveThird),
                    higherIsBetter: true,
                  },
                  {
                    label: '% Metade Defensiva',
                    p1Value: player1.positioning.avgDefensiveHalf,
                    p2Value: player2.positioning.avgDefensiveHalf,
                    p1Formatted: formatPercentage(player1.positioning.avgDefensiveHalf),
                    p2Formatted: formatPercentage(player2.positioning.avgDefensiveHalf),
                    higherIsBetter: true,
                  },
                  {
                    label: '% Atras da Bola (Goal-Side)',
                    p1Value: player1.positioning.avgBehindBall,
                    p2Value: player2.positioning.avgBehindBall,
                    p1Formatted: formatPercentage(player1.positioning.avgBehindBall),
                    p2Formatted: formatPercentage(player2.positioning.avgBehindBall),
                    higherIsBetter: true,
                  },
                  {
                    label: '% A Frente da Bola',
                    p1Value: player1.positioning.avgInfrontBall,
                    p2Value: player2.positioning.avgInfrontBall,
                    p1Formatted: formatPercentage(player1.positioning.avgInfrontBall),
                    p2Formatted: formatPercentage(player2.positioning.avgInfrontBall),
                    higherIsBetter: false,
                  },
                  {
                    label: 'Espacamento c/ Parceiro',
                    p1Value: player1.positioning.avgDistanceToTeammate,
                    p2Value: player2.positioning.avgDistanceToTeammate,
                    p1Formatted: `${formatNumber(player1.positioning.avgDistanceToTeammate, 0)} uu`,
                    p2Formatted: `${formatNumber(player2.positioning.avgDistanceToTeammate, 0)} uu`,
                    higherIsBetter: true,
                  },
                  {
                    label: '% Ultimo Homem (Last Man)',
                    p1Value: player1.positioning.avgMostBack,
                    p2Value: player2.positioning.avgMostBack,
                    p1Formatted: formatPercentage(player1.positioning.avgMostBack),
                    p2Formatted: formatPercentage(player2.positioning.avgMostBack),
                    higherIsBetter: true,
                  },
                  {
                    label: '% Primeiro Homem (1st Man)',
                    p1Value: player1.positioning.avgMostForward,
                    p2Value: player2.positioning.avgMostForward,
                    p1Formatted: formatPercentage(player1.positioning.avgMostForward),
                    p2Formatted: formatPercentage(player2.positioning.avgMostForward),
                    higherIsBetter: true,
                  },
                ]}
              />
            </div>

            {/* Desktop 2-Column Grid: Mecanica & Fisicalidade */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Mecanica & Velocidade */}
              <CompareSection
                title="Mecanica & Movimentacao"
                icon={Gauge}
                iconColor="text-purple-400"
                badgeText="Agilidade & Ar"
                metrics={[
                  {
                    label: 'Velocidade Media',
                    p1Value: player1.movement.avgSpeed,
                    p2Value: player2.movement.avgSpeed,
                    p1Formatted: `${formatNumber(player1.movement.avgSpeed, 0)} uu/s`,
                    p2Formatted: `${formatNumber(player2.movement.avgSpeed, 0)} uu/s`,
                    higherIsBetter: true,
                  },
                  {
                    label: '% Tempo Supersonico',
                    p1Value: player1.movement.avgSupersonicPercent,
                    p2Value: player2.movement.avgSupersonicPercent,
                    p1Formatted: formatPercentage(player1.movement.avgSupersonicPercent),
                    p2Formatted: formatPercentage(player2.movement.avgSupersonicPercent),
                    higherIsBetter: true,
                  },
                  {
                    label: '% Tempo Boost Speed',
                    p1Value: player1.movement.avgBoostSpeedPercent,
                    p2Value: player2.movement.avgBoostSpeedPercent,
                    p1Formatted: formatPercentage(player1.movement.avgBoostSpeedPercent),
                    p2Formatted: formatPercentage(player2.movement.avgBoostSpeedPercent),
                    higherIsBetter: true,
                  },
                  {
                    label: '% Tempo no Chao / Parede',
                    p1Value: player1.movement.avgGroundPercent,
                    p2Value: player2.movement.avgGroundPercent,
                    p1Formatted: formatPercentage(player1.movement.avgGroundPercent),
                    p2Formatted: formatPercentage(player2.movement.avgGroundPercent),
                    higherIsBetter: true,
                  },
                  {
                    label: '% Tempo Ar Baixo',
                    p1Value: player1.movement.avgLowAirPercent,
                    p2Value: player2.movement.avgLowAirPercent,
                    p1Formatted: formatPercentage(player1.movement.avgLowAirPercent),
                    p2Formatted: formatPercentage(player2.movement.avgLowAirPercent),
                    higherIsBetter: true,
                  },
                  {
                    label: '% Tempo Ar Alto (Aerials)',
                    p1Value: player1.movement.avgHighAirPercent,
                    p2Value: player2.movement.avgHighAirPercent,
                    p1Formatted: formatPercentage(player1.movement.avgHighAirPercent),
                    p2Formatted: formatPercentage(player2.movement.avgHighAirPercent),
                    higherIsBetter: true,
                  },
                  {
                    label: 'Powerslides / Jogo',
                    p1Value: player1.movement.avgPowerslideCount,
                    p2Value: player2.movement.avgPowerslideCount,
                    p1Formatted: `${player1.movement.avgPowerslideCount}`,
                    p2Formatted: `${player2.movement.avgPowerslideCount}`,
                    higherIsBetter: true,
                  },
                ]}
              />

              {/* Fisicalidade & Demolicoes */}
              <CompareSection
                title="Fisicalidade & Demolicoes"
                icon={Swords}
                iconColor="text-rose-500"
                badgeText="Contato Fisico"
                metrics={[
                  {
                    label: 'Demos Infligidos / Jogo',
                    p1Value: player1.demos.avgInflicted,
                    p2Value: player2.demos.avgInflicted,
                    p1Formatted: formatNumber(player1.demos.avgInflicted, 2),
                    p2Formatted: formatNumber(player2.demos.avgInflicted, 2),
                    higherIsBetter: true,
                  },
                  {
                    label: 'Demos Sofridos / Jogo',
                    p1Value: player1.demos.avgTaken,
                    p2Value: player2.demos.avgTaken,
                    p1Formatted: formatNumber(player1.demos.avgTaken, 2),
                    p2Formatted: formatNumber(player2.demos.avgTaken, 2),
                    higherIsBetter: false,
                  },
                  {
                    label: 'Ratio de Demos (I/S)',
                    p1Value: player1.demos.demoRatio,
                    p2Value: player2.demos.demoRatio,
                    p1Formatted: formatNumber(player1.demos.demoRatio, 2),
                    p2Formatted: formatNumber(player2.demos.demoRatio, 2),
                    higherIsBetter: true,
                  },
                ]}
              />
            </div>

            {/* Contribuicao Proporcional do Time (Graficos Donut Widescreen) */}
            <TeamContributionChart player1={player1} player2={player2} />

            {/* Cards EA FC Ultimate Dupla */}
            <FutCardsSection player1={player1} player2={player2} />

            {/* Evolucao Temporal & Tendencias (Widescreen PC) */}
            <TrendChart
              player1History={player1.matchHistory}
              player2History={player2.matchHistory}
              player1Name={player1.playerName}
              player2Name={player2.playerName}
            />
          </>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-[#232736] bg-[#090a0f] py-6 text-center text-xs text-zinc-500 space-y-1.5">
        <p className="font-semibold text-zinc-300">Leok07 (Epic) vs Theuszrib (PS5)</p>
        <p className="text-xs text-zinc-500">Telemetria & Comparativo 2v2 • Ballchasing API</p>
        <p className="text-[11px] text-zinc-600 font-mono">versao 1.5.0 • Desktop Edition</p>
      </footer>
    </div>
  );
}
