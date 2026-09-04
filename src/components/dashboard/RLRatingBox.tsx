'use client';

import React, { useState } from 'react';
import { AggregatedPlayerDashboard } from '@/types/dashboard';
import { calculateRLRating } from '@/lib/rating-calculator';
import {
  Activity,
  Target,
  Zap,
  Shield,
  Compass,
  Gauge,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface RLRatingBoxProps {
  player1: AggregatedPlayerDashboard;
  player2: AggregatedPlayerDashboard;
}

export function RLRatingBox({ player1, player2 }: RLRatingBoxProps) {
  const [showDetails, setShowDetails] = useState(false);

  const r1 = calculateRLRating(player1);
  const r2 = calculateRLRating(player2);

  const subRatingItems = [
    {
      key: 'combat',
      label: 'Combate & Finalizacao',
      weight: '30%',
      icon: Target,
      color: 'text-emerald-400',
      p1Val: r1.pillars.combat,
      p2Val: r2.pillars.combat,
      description: 'Gols/5m, Chutes/5m e Precisao de Chute',
    },
    {
      key: 'impact',
      label: 'Impacto & Decisao',
      weight: '25%',
      icon: Zap,
      color: 'text-amber-400',
      p1Val: r1.pillars.impact,
      p2Val: r2.pillars.impact,
      description: 'Score medio, Taxa de MVP nas vitorias e Demos infligidos',
    },
    {
      key: 'defense',
      label: 'Solidez Defensiva',
      weight: '20%',
      icon: Shield,
      color: 'text-cyan-400',
      p1Val: r1.pillars.defense,
      p2Val: r2.pillars.defense,
      description: 'Saves/5m, Posicionamento Goal-Side e Terco Defensivo',
    },
    {
      key: 'support',
      label: 'Criacao & Suporte',
      weight: '15%',
      icon: Compass,
      color: 'text-purple-400',
      p1Val: r1.pillars.support,
      p2Val: r2.pillars.support,
      description: 'Assistencias/5m e Presenca no Terco Ofensivo',
    },
    {
      key: 'efficiency',
      label: 'Eficiencia & Movimento',
      weight: '10%',
      icon: Gauge,
      color: 'text-rose-400',
      p1Val: r1.pillars.efficiency,
      p2Val: r2.pillars.efficiency,
      description: 'Velocidade media, Tempo supersonico e Economia de Boost',
    },
  ];

  return (
    <div className="rounded-2xl bg-[#11131a] border border-[#232736] p-4 sm:p-6 space-y-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232736]/60 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-950/70 border border-indigo-800/60 text-indigo-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
              RLRating 3.0 • Indice Composto de Performance
            </h3>
            <p className="text-xs text-zinc-400">
              Metrica multivariada centrada na nota base 1.00 (Media competitiva do rank)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white bg-[#181a24] hover:bg-[#202433] px-3 py-1.5 rounded-lg border border-[#2c3245] transition-colors self-start sm:self-auto"
        >
          <Info className="w-3.5 h-3.5 text-sky-400" />
          <span>{showDetails ? 'Ocultar Formula' : 'Como Funciona?'}</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Rating Score Hero Cards - Desktop 2-Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player 1 Rating Card */}
        <div
          className={`p-5 rounded-xl border relative overflow-hidden flex flex-col justify-between space-y-3 transition-all ${
            r1.overallRating >= r2.overallRating
              ? 'bg-gradient-to-br from-sky-950/40 via-[#181a24] to-[#11131a] border-sky-600/60 shadow-[0_0_20px_rgba(56,189,248,0.1)]'
              : 'bg-[#181a24] border-[#232736]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
              <span className="text-base font-black text-sky-400">{player1.playerName}</span>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${r1.tierColor}`}>
              {r1.tierLabel}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
              {r1.overallRating.toFixed(2)}
            </span>
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              RLRating 3.0
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-[#232736]/60 pt-2">
            <span>Combate: <strong className="text-zinc-200">{r1.pillars.combat.toFixed(2)}</strong></span>
            <span>Impacto: <strong className="text-zinc-200">{r1.pillars.impact.toFixed(2)}</strong></span>
            <span>Defesa: <strong className="text-zinc-200">{r1.pillars.defense.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* Player 2 Rating Card */}
        <div
          className={`p-5 rounded-xl border relative overflow-hidden flex flex-col justify-between space-y-3 transition-all ${
            r2.overallRating >= r1.overallRating
              ? 'bg-gradient-to-br from-orange-950/40 via-[#181a24] to-[#11131a] border-orange-600/60 shadow-[0_0_20px_rgba(251,146,60,0.1)]'
              : 'bg-[#181a24] border-[#232736]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
              <span className="text-base font-black text-orange-400">{player2.playerName}</span>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${r2.tierColor}`}>
              {r2.tierLabel}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
              {r2.overallRating.toFixed(2)}
            </span>
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              RLRating 3.0
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-[#232736]/60 pt-2">
            <span>Combate: <strong className="text-zinc-200">{r2.pillars.combat.toFixed(2)}</strong></span>
            <span>Impacto: <strong className="text-zinc-200">{r2.pillars.impact.toFixed(2)}</strong></span>
            <span>Defesa: <strong className="text-zinc-200">{r2.pillars.defense.toFixed(2)}</strong></span>
          </div>
        </div>
      </div>

      {/* 5 Sub-Rating Pillar Comparison Rows */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
          Detalhamento dos 5 Pilares do RLRating
        </span>

        <div className="grid grid-cols-1 gap-2.5">
          {subRatingItems.map((item) => {
            const total = item.p1Val + item.p2Val;
            const p1Pct = total > 0 ? (item.p1Val / total) * 100 : 50;
            const p2Pct = total > 0 ? 100 - p1Pct : 50;
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                className="p-3 rounded-xl bg-[#181a24]/80 border border-[#232736] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="text-left w-24">
                    <span className="text-sm font-bold text-sky-400 font-mono">
                      {item.p1Val.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-zinc-200 font-semibold text-xs">
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                    <span>{item.label}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">({item.weight})</span>
                  </div>

                  <div className="text-right w-24">
                    <span className="text-sm font-bold text-orange-400 font-mono">
                      {item.p2Val.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full bg-[#11131a] rounded-full overflow-hidden flex">
                  <div
                    className="bg-gradient-to-r from-sky-600 to-sky-400 transition-all duration-500 rounded-l-full"
                    style={{ width: `${p1Pct}%` }}
                  />
                  <div
                    className="bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500 rounded-r-full"
                    style={{ width: `${p2Pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation Section Underneath */}
      {showDetails && (
        <div className="p-4 rounded-xl bg-[#141722] border border-[#232736] space-y-3 text-xs text-zinc-300 transition-all animate-fadeIn">
          <div className="flex items-center gap-2 text-zinc-100 font-bold uppercase tracking-wider text-xs">
            <Info className="w-4 h-4 text-sky-400" />
            <span>Como o RLRating 3.0 e Calculado?</span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            O <strong className="text-zinc-200">RLRating 3.0</strong> e um indice matematico ponderado que avalia o impacto real de cada jogador em 2v2. Ele nao depende apenas de vitorias ou score bruto, mas cruza a eficiencia de 5 areas independentes contra a media esperada (base 1.00):
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-[11px]">
            <div className="p-2.5 rounded-lg bg-[#11131a] border border-[#232736]">
              <strong className="text-emerald-400 block mb-0.5">1. Combate (Peso 30%):</strong>
              Volume de gols a cada 5 min, frequencia de chutes e precisao de finalizacao (eficiencia de pontaria).
            </div>
            <div className="p-2.5 rounded-lg bg-[#11131a] border border-[#232736]">
              <strong className="text-amber-400 block mb-0.5">2. Impacto (Peso 25%):</strong>
              Pontuacao por minuto de jogo, taxa de conversao de MVP nas vitorias e demolicoes infligidas.
            </div>
            <div className="p-2.5 rounded-lg bg-[#11131a] border border-[#232736]">
              <strong className="text-cyan-400 block mb-0.5">3. Defesa (Peso 20%):</strong>
              Saves a cada 5 min, tempo de cobertura atras da linha da bola (Goal-Side) e metade defensiva.
            </div>
            <div className="p-2.5 rounded-lg bg-[#11131a] border border-[#232736]">
              <strong className="text-purple-400 block mb-0.5">4. Suporte (Peso 15%):</strong>
              Assistencias normalizadas por tempo e presenca territorial no terco de ataque.
            </div>
            <div className="p-2.5 rounded-lg bg-[#11131a] border border-[#232736] md:col-span-2">
              <strong className="text-rose-400 block mb-0.5">5. Eficiencia & Movimento (Peso 10%):</strong>
              Velocidade media do veiculo, porcentagem de tempo supersonico e penalizacao de desperdicio ou tempo zerado de boost.
            </div>
          </div>

          <div className="border-t border-[#232736]/60 pt-2 text-[11px] text-zinc-400 flex flex-wrap gap-4">
            <span><strong className="text-amber-300">1.30+</strong>: Dominante (Elite)</span>
            <span><strong className="text-emerald-300">1.15 a 1.29</strong>: Alto Impacto</span>
            <span><strong className="text-sky-300">1.00 a 1.14</strong>: Solido (Na Media)</span>
            <span><strong className="text-orange-300">0.85 a 0.99</strong>: Abaixo da Media</span>
            <span><strong className="text-rose-300">&lt; 0.85</strong>: Critico</span>
          </div>
        </div>
      )}
    </div>
  );
}
