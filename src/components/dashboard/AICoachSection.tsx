'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Bot,
  Sparkles,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
  Target,
  Shield,
  Zap,
  Crosshair,
  Flame,
  Award,
  ChevronRight,
  Database,
  Cpu,
  Layers
} from 'lucide-react';
import { AggregatedPlayerDashboard, SharedMatchItem } from '@/types/dashboard';
import { AiCoachAnalysis, AiCoachApiResponse, AiCoachRequestBody } from '@/types/ai-coach';

interface AICoachSectionProps {
  player1: AggregatedPlayerDashboard;
  player2: AggregatedPlayerDashboard;
  sharedMatches: SharedMatchItem[];
}

const LOCAL_STORAGE_KEY = 'rl_duo_ai_coach_cache_v1';

export function AICoachSection({ player1, player2, sharedMatches }: AICoachSectionProps) {
  const [analysis, setAnalysis] = useState<AiCoachAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'leaks' | 'roadmap' | 'gameplan'>('overview');
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'cache' | 'gemini' | 'heuristic' | null>(null);

  // Assinatura estrita das partidas: so muda se entrar partida nova
  const currentCacheKey = useMemo(() => {
    if (!sharedMatches || sharedMatches.length === 0) return 'no_matches';
    const latestMatch = sharedMatches[0];
    const total = sharedMatches.length;
    return `duo_${total}_${latestMatch.id}_${latestMatch.date}`;
  }, [sharedMatches]);

  const loadAnalysis = useCallback(
    async (force = false) => {
      if (!sharedMatches || sharedMatches.length === 0) return;

      // 1. Tentar ler do localStorage do cliente se nao for forceRefresh
      if (!force) {
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.cacheKey === currentCacheKey && parsed.data) {
              setAnalysis(parsed.data);
              setLastSavedTimestamp(parsed.data.metadata?.generatedAt || null);
              setDataSource('cache');
              return;
            }
          }
        } catch {
          // Ignora erro de leitura do storage
        }
      }

      // 2. Chamar o backend (que checa cache em disco antes de chamar a IA)
      setIsLoading(true);

      const wins = sharedMatches.filter((m) => m.result === 'win').length;
      const losses = sharedMatches.length - wins;
      const recentMatches = sharedMatches.slice(0, 5);

      const requestBody: AiCoachRequestBody = {
        cacheKey: currentCacheKey,
        forceRefresh: force,
        player1: {
          name: player1.playerName,
          stats: {
            session: player1.session,
            boost: player1.boost,
            movement: player1.movement,
            positioning: player1.positioning,
            demo: player1.demos
          }
        },
        player2: {
          name: player2.playerName,
          stats: {
            session: player2.session,
            boost: player2.boost,
            movement: player2.movement,
            positioning: player2.positioning,
            demo: player2.demos
          }
        },
        sharedMatchesSummary: {
          totalMatches: sharedMatches.length,
          recentMatchesCount: recentMatches.length,
          wins,
          losses,
          matchIds: sharedMatches.map((m) => m.id),
          latestMatchDate: sharedMatches[0]?.date || ''
        }
      };

      try {
        const response = await fetch('/api/ai-coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error(`Erro na API (${response.status})`);
        }

        const json: AiCoachApiResponse = await response.json();
        if (json.success && json.data) {
          setAnalysis(json.data);
          setLastSavedTimestamp(json.data.metadata?.generatedAt || new Date().toISOString());
          setDataSource(json.cached ? 'cache' : json.data.metadata?.source || 'gemini');

          // Salvar em localStorage para zero delay nas proximas visitas
          try {
            localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify({ cacheKey: currentCacheKey, data: json.data })
            );
          } catch {
            // Ignora falha de cota de storage
          }
        }
      } catch (err) {
        console.error('Falha ao obter analise do AI Coach:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [currentCacheKey, player1, player2, sharedMatches]
  );

  useEffect(() => {
    if (sharedMatches.length > 0) {
      loadAnalysis(false);
    }
  }, [currentCacheKey, loadAnalysis, sharedMatches.length]);

  if (!sharedMatches || sharedMatches.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full rounded-2xl bg-[#090b10] border border-cyan-950/60 p-5 sm:p-7 shadow-2xl overflow-hidden my-8">
      {/* Background Cyber Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1322_1px,transparent_1px),linear-gradient(to_bottom,#0c1322_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Top Header Command Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cyan-950/80">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-[0.2em] text-white">
                Centro Tático de IA
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                Gemini 2.5 Pro Powered
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Inteligência tática competitiva exclusiva para a dupla {player1.playerName} & {player2.playerName}
            </p>
          </div>
        </div>

        {/* Status and Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {dataSource === 'cache'
                ? 'Cache Persistente Ativo'
                : dataSource === 'gemini'
                ? 'Analise Gerada via Gemini'
                : 'Analise Tática Ativa'}
            </span>
            <span className="text-slate-500 mx-1">•</span>
            <span className="text-slate-400 font-mono text-[11px]">
              {sharedMatches.length} jogos
            </span>
          </div>

          <button
            onClick={() => loadAnalysis(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 text-xs font-semibold text-cyan-200 transition-all active:scale-95 disabled:opacity-50"
            title="Forcar nova analise detalhada com o Gemini"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isLoading ? 'Analisando...' : 'Reanalisar'}</span>
          </button>
        </div>
      </div>

      {/* Info Notice about Cache Rule */}
      <div className="relative z-10 mt-3 px-3.5 py-2 rounded-lg bg-blue-950/30 border border-blue-900/40 flex items-center justify-between text-[11px] text-blue-300/80">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>
            Analise sincronizada e fixada na serie atual. Novos calculos sao disparados apenas quando novas partidas forem detectadas no sistema.
          </span>
        </div>
        {lastSavedTimestamp && (
          <span className="hidden sm:inline font-mono text-[10px] text-slate-400">
            Atualizado: {new Date(lastSavedTimestamp).toLocaleDateString('pt-BR')} {new Date(lastSavedTimestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {isLoading && !analysis && (
        <div className="relative z-10 py-16 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm font-semibold tracking-wider uppercase text-cyan-300">
            Processando telemetria completa de 20 partidas...
          </p>
          <p className="text-xs text-slate-400">
            Avaliando dinamica de rotacao, 50/50s, backboard e economia de boost
          </p>
        </div>
      )}

      {analysis && (
        <div className="relative z-10 mt-6 space-y-6">
          {/* Top Row: Synergy Hero Card & Quick Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Sinergia Card (4 colunas) */}
            <div className="lg:col-span-4 rounded-xl bg-gradient-to-br from-[#0e1626] to-[#0a0e1a] border border-cyan-500/30 p-5 flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-950/60">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  Indice de Sinergia
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  2v2 Rank
                </span>
              </div>

              <div className="py-4 flex items-center gap-5">
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-[#060a12] border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.2)]">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-3xl font-black tracking-tight text-white">
                      {analysis.synergy.score}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                      / 100
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="text-sm font-black uppercase tracking-wider text-white">
                    {analysis.synergy.verdict}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {analysis.synergy.summary}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-cyan-950/60 flex items-center justify-between text-xs text-slate-400">
                <span>Forma Atual</span>
                <span className="font-bold text-cyan-300 uppercase tracking-wider">
                  {analysis.recentFormMicro.trend === 'alta' ? 'Em Ascensao' : 'Consolidada'}
                </span>
              </div>
            </div>

            {/* Recorte Recente / Hot Zone (8 colunas) */}
            <div className="lg:col-span-8 rounded-xl bg-gradient-to-br from-[#10131d] to-[#0a0d14] border border-slate-800 p-5 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                    Recorte Recente • Ultimas {analysis.recentFormMicro.matchCount} Partidas
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Trend Imediata
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                <div className="p-3 rounded-lg bg-[#07090e] border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Ajuste Tático Notado
                  </span>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {analysis.recentFormMicro.keyShift}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#07090e] border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Destaque da Rodada
                  </span>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {analysis.recentFormMicro.hotPlayer}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#07090e] border border-rose-950/50 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    Aviso Crítico Imediato
                  </span>
                  <p className="text-xs text-rose-200/90 font-medium leading-relaxed">
                    {analysis.recentFormMicro.criticalNotice}
                  </p>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Taxa de Vitoria Geral na Amostra</span>
                <span className="font-mono font-bold text-white">
                  {analysis.macroOverview.winRate}% ({analysis.macroOverview.matchCount} Jogos)
                </span>
              </div>
            </div>
          </div>

          {/* Tactical Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'overview'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Geral 20 Partidas (Macro)</span>
            </button>

            <button
              onClick={() => setActiveTab('leaks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'leaks'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Diagnóstico de Vazamentos</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'roadmap'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Roadmap para Grand Champion</span>
            </button>

            <button
              onClick={() => setActiveTab('gameplan')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'gameplan'
                  ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>3 Regras de Jogo</span>
            </button>
          </div>

          {/* TAB 1: Macro Overview (20 Jogos) */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#0c0f17] border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Target className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Dinâmica Ofensiva</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analysis.macroOverview.offensiveDynamics}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0c0f17] border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Shield className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Âncora Defensiva</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analysis.macroOverview.defensiveAnchor}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0c0f17] border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Zap className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Economia de Boost</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analysis.macroOverview.boostEconomy}
                  </p>
                </div>
              </div>

              {/* Strengths & Bottlenecks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#0c121e] border border-cyan-900/50 space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Pontos Fortes Consolidados (20 Jogos)
                  </span>
                  <ul className="space-y-2">
                    {analysis.macroOverview.keyStrengths.map((st, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-cyan-400 font-mono font-bold">{i + 1}.</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#180e14] border border-rose-900/50 space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    Gargalos Críticos a Serem Eliminados
                  </span>
                  <ul className="space-y-2">
                    {analysis.macroOverview.bottlenecks.map((bn, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-rose-400 font-mono font-bold">{i + 1}.</span>
                        <span>{bn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Diagnostico de Vazamentos Taticos */}
          {activeTab === 'leaks' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.leakageDiagnosis.map((leak, idx) => {
                const isCrit = leak.severity === 'critica';
                const isMod = leak.severity === 'moderada';
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl flex flex-col justify-between border ${
                      isCrit
                        ? 'bg-[#180d14] border-rose-900/70 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                        : isMod
                        ? 'bg-[#18140c] border-amber-900/70'
                        : 'bg-[#0f141f] border-blue-900/70'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                          Vazamento #{idx + 1}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                            isCrit
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : isMod
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}
                        >
                          Gravidade {leak.severity}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white pt-1">{leak.title}</h4>

                      <div className="space-y-1.5 text-xs">
                        <p className="text-slate-400">
                          <span className="font-semibold text-slate-300">Gatilho:</span> {leak.metricTrigger}
                        </p>
                        <p className="text-slate-400">
                          <span className="font-semibold text-slate-300">Impacto:</span> {leak.impact}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                        Correção Prática:
                      </span>
                      <p className="text-xs text-cyan-100 font-medium leading-relaxed">
                        {leak.correction}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: Roadmap para Grand Champion */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              {analysis.roadToGc.map((road, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-gradient-to-r from-[#0d1320] via-[#090e18] to-[#070a12] border border-cyan-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                        Passo {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">{road.step}</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Prioridade Tática:</span>
                        <span className="text-slate-200 font-medium">{road.priority}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Treino Recomendado:</span>
                        <span className="text-amber-300 font-medium">{road.drill}</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-64 p-3 rounded-lg bg-[#06080e] border border-slate-800 shrink-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 block">
                      Métrica Alvo Ballchasing:
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-200 mt-0.5 block">
                      {road.targetMetric}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: 3 Regras de Jogo Executáveis */}
          {activeTab === 'gameplan' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.gameplanRules.map((gp) => (
                <div
                  key={gp.number}
                  className="p-5 rounded-xl bg-gradient-to-b from-[#111420] to-[#090c14] border border-indigo-900/50 flex flex-col justify-between shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-950 border border-indigo-500/40 font-mono font-bold text-xs text-indigo-300">
                        {gp.number}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                        Regra de Ouro
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{gp.title}</h4>

                    <div className="p-2.5 rounded-lg bg-[#070910] border border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Gatilho em Jogo:
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {gp.trigger}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-indigo-950/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                      Ação Obrigatória:
                    </span>
                    <p className="text-xs text-white font-medium leading-relaxed">
                      {gp.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
