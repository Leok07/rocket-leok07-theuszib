'use client';

import React, { useState, useMemo } from 'react';
import {
  AiCoachPitchAnalysis,
  AiCoachFieldMarker,
  AiCoachPitchZone
} from '@/types/ai-coach';
import { AggregatedPlayerDashboard } from '@/types/dashboard';
import {
  Target,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  ChevronRight,
  Sparkles,
  Compass,
  Info
} from 'lucide-react';

interface TacticalPitchHeatmapProps {
  player1: AggregatedPlayerDashboard;
  player2: AggregatedPlayerDashboard;
  pitchAnalysis?: AiCoachPitchAnalysis;
}

type HeatmapMode = 'duo' | 'p1' | 'p2' | 'markers';

export function TacticalPitchHeatmap({
  player1,
  player2,
  pitchAnalysis,
}: TacticalPitchHeatmapProps) {
  const [activeMode, setActiveMode] = useState<HeatmapMode>('markers');
  const [selectedMarker, setSelectedMarker] = useState<AiCoachFieldMarker | null>(null);

  const p1Pos = player1.positioning;
  const p2Pos = player2.positioning;

  // Set default selected marker to the first error or success if available
  const allMarkers = useMemo(() => {
    const hits = pitchAnalysis?.tacticalSuccesses || [];
    const errs = pitchAnalysis?.tacticalErrors || [];
    return [...hits, ...errs];
  }, [pitchAnalysis]);

  const activeMarker = selectedMarker || (allMarkers.length > 0 ? allMarkers[0] : null);

  // Calculate heat gradients based on real player positioning percentages
  const p1Def = p1Pos.avgDefensiveThird || 38;
  const p1Mid = p1Pos.avgNeutralThird || 34;
  const p1Off = p1Pos.avgOffensiveThird || 28;

  const p2Def = p2Pos.avgDefensiveThird || 44;
  const p2Mid = p2Pos.avgNeutralThird || 33;
  const p2Off = p2Pos.avgOffensiveThird || 23;

  return (
    <div className="w-full rounded-xl bg-[#080b12] border border-cyan-950/70 p-5 sm:p-6 shadow-xl mt-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(6,182,212,0.06),transparent_60%)] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-950/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black uppercase tracking-[0.2em] text-white">
                Campinho Tático 2D & Heatmap
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                IA Espacial
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Mapeamento de calor posicional com diagnóstico de acertos e erros no campo
            </p>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center flex-wrap gap-1.5 p-1 rounded-lg bg-[#05070c] border border-slate-800/80">
          <button
            onClick={() => setActiveMode('markers')}
            className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === 'markers'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Acertos & Erros (IA)
          </button>
          <button
            onClick={() => setActiveMode('duo')}
            className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === 'duo'
                ? 'bg-purple-950 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Calor da Dupla
          </button>
          <button
            onClick={() => setActiveMode('p1')}
            className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === 'p1'
                ? 'bg-sky-950 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {player1.playerName}
          </button>
          <button
            onClick={() => setActiveMode('p2')}
            className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === 'p2'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {player2.playerName}
          </button>
        </div>
      </div>

      {/* Main Pitch & Telemetry Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Left Column: Authentic 2D Rocket League Pitch (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[1/1.6] rounded-2xl bg-[#04060a] border-2 border-slate-700/80 p-3 shadow-2xl overflow-hidden select-none">
            {/* Field Turf Lines (Authentic Rocket League Arena Geometry) */}
            <svg
              className="w-full h-full"
              viewBox="0 0 300 480"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Boundary with Rounded Chamfered Corners */}
              <rect
                x="15"
                y="15"
                width="270"
                height="450"
                rx="28"
                stroke="#334155"
                strokeWidth="2"
                fill="none"
              />

              {/* Goal Boxes */}
              {/* Top Opponent Goal */}
              <rect
                x="105"
                y="6"
                width="90"
                height="10"
                rx="2"
                stroke="#f43f5e"
                strokeWidth="2"
                fill="#f43f5e"
                fillOpacity="0.15"
              />
              {/* Bottom Friendly Goal */}
              <rect
                x="105"
                y="464"
                width="90"
                height="10"
                rx="2"
                stroke="#38bdf8"
                strokeWidth="2"
                fill="#38bdf8"
                fillOpacity="0.15"
              />

              {/* Halfway Line */}
              <line
                x1="15"
                y1="240"
                x2="285"
                y2="240"
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Center Circle */}
              <circle
                cx="150"
                cy="240"
                r="46"
                stroke="#334155"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="150" cy="240" r="3" fill="#64748b" />

              {/* Third Divisions (Defensive, Neutral, Offensive) */}
              <line
                x1="15"
                y1="160"
                x2="285"
                y2="160"
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1="15"
                y1="320"
                x2="285"
                y2="320"
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Penalty / Goal Creases */}
              <path
                d="M 90 15 C 90 55, 210 55, 210 15"
                stroke="#334155"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M 90 465 C 90 425, 210 425, 210 465"
                stroke="#334155"
                strokeWidth="1.5"
                fill="none"
              />

              {/* Corner Angles / Ramps */}
              <line x1="15" y1="50" x2="50" y2="15" stroke="#334155" strokeWidth="1.5" />
              <line x1="250" y1="15" x2="285" y2="50" stroke="#334155" strokeWidth="1.5" />
              <line x1="15" y1="430" x2="50" y2="465" stroke="#334155" strokeWidth="1.5" />
              <line x1="250" y1="465" x2="285" y2="430" stroke="#334155" strokeWidth="1.5" />

              {/* 6 Full Boost Pads (100 Boosters) */}
              {/* Corner Boosts */}
              <circle cx="36" cy="40" r="6" fill="#f59e0b" fillOpacity="0.8" stroke="#d97706" strokeWidth="1.5" />
              <circle cx="264" cy="40" r="6" fill="#f59e0b" fillOpacity="0.8" stroke="#d97706" strokeWidth="1.5" />
              <circle cx="36" cy="440" r="6" fill="#f59e0b" fillOpacity="0.8" stroke="#d97706" strokeWidth="1.5" />
              <circle cx="264" cy="440" r="6" fill="#f59e0b" fillOpacity="0.8" stroke="#d97706" strokeWidth="1.5" />
              {/* Midfield Boosts */}
              <circle cx="28" cy="240" r="6" fill="#f59e0b" fillOpacity="0.8" stroke="#d97706" strokeWidth="1.5" />
              <circle cx="272" cy="240" r="6" fill="#f59e0b" fillOpacity="0.8" stroke="#d97706" strokeWidth="1.5" />

              {/* Small Boost Pad Lines (Indicators) */}
              <circle cx="150" cy="190" r="2.5" fill="#e2e8f0" fillOpacity="0.4" />
              <circle cx="150" cy="290" r="2.5" fill="#e2e8f0" fillOpacity="0.4" />
              <circle cx="100" cy="240" r="2.5" fill="#e2e8f0" fillOpacity="0.4" />
              <circle cx="200" cy="240" r="2.5" fill="#e2e8f0" fillOpacity="0.4" />
              <circle cx="150" cy="115" r="2.5" fill="#e2e8f0" fillOpacity="0.4" />
              <circle cx="150" cy="365" r="2.5" fill="#e2e8f0" fillOpacity="0.4" />

              {/* Dynamic Heatmap Layer */}
              {(activeMode === 'duo' || activeMode === 'p1') && (
                <g opacity="0.6">
                  {/* P1 Heat: Concentrated around defensive and mid transition */}
                  <ellipse
                    cx="135"
                    cy={400 - (p1Def * 1.5)}
                    rx={60 + (p1Def * 0.4)}
                    ry={40 + (p1Def * 0.4)}
                    fill="url(#p1GradientDef)"
                  />
                  <ellipse
                    cx="155"
                    cy={240}
                    rx={50 + (p1Mid * 0.3)}
                    ry={35 + (p1Mid * 0.3)}
                    fill="url(#p1GradientMid)"
                  />
                  <ellipse
                    cx="160"
                    cy={100 + (p1Off * 0.8)}
                    rx={45 + (p1Off * 0.3)}
                    ry={30 + (p1Off * 0.3)}
                    fill="url(#p1GradientOff)"
                  />
                </g>
              )}

              {(activeMode === 'duo' || activeMode === 'p2') && (
                <g opacity="0.6">
                  {/* P2 Heat: Anchor defense and second man shadow */}
                  <ellipse
                    cx="165"
                    cy={410 - (p2Def * 1.4)}
                    rx={65 + (p2Def * 0.4)}
                    ry={45 + (p2Def * 0.4)}
                    fill="url(#p2GradientDef)"
                  />
                  <ellipse
                    cx="145"
                    cy={250}
                    rx={45 + (p2Mid * 0.3)}
                    ry={30 + (p2Mid * 0.3)}
                    fill="url(#p2GradientMid)"
                  />
                </g>
              )}

              {/* Defs for Gradients */}
              <defs>
                <radialGradient id="p1GradientDef" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
                  <stop offset="60%" stopColor="#0284c7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="p1GradientMid" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.55" />
                  <stop offset="70%" stopColor="#0891b2" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="p1GradientOff" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                  <stop offset="80%" stopColor="#0284c7" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="p2GradientDef" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.65" />
                  <stop offset="60%" stopColor="#d97706" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="p2GradientMid" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
                  <stop offset="70%" stopColor="#b45309" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>

            {/* AI Tactical Markers (Hits & Errors Overlay on Pitch) */}
            {allMarkers.map((marker) => {
              const isHit = marker.type === 'acerto';
              const isSelected = activeMarker?.id === marker.id;

              // Convert normalized coordinates (0-100) to pitch percentage
              // y: 0 is defense bottom (85%), 100 is offense top (15%)
              const leftPercent = Math.max(12, Math.min(88, marker.x));
              const topPercent = Math.max(12, Math.min(88, 100 - marker.y));

              return (
                <button
                  key={marker.id}
                  onClick={() => setSelectedMarker(marker)}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-200 z-20 ${
                    isSelected ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-black' : 'hover:scale-115'
                  }`}
                  title={`${marker.title} (${marker.zone})`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border ${
                      isHit
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                        : 'bg-rose-950 border-rose-400 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                    }`}
                  >
                    {isHit ? (
                      <Target className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Field Label Overlays */}
            <div className="absolute top-4 inset-x-0 flex justify-center pointer-events-none">
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-rose-950/70 border border-rose-500/30 text-rose-300">
                Ataque / Gol Adversário
              </span>
            </div>
            <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-sky-950/70 border border-sky-500/30 text-sky-300">
                Defesa / Nosso Gol
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Acertos Táticos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Erros Táticos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Boost 100</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Spatial Diagnosis & Telemetry Breakdown (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Executive AI Pitch Verdict */}
          {pitchAnalysis && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#0d1424] to-[#070b14] border border-cyan-900/50 shadow-md">
              <div className="flex items-center gap-2 text-cyan-400 mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Veredito Espacial da IA
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {pitchAnalysis.spatialVerdict}
              </p>
            </div>
          )}

          {/* Active Marker Detail Card (Hit or Error) */}
          {activeMarker ? (
            <div
              className={`p-4 rounded-xl border shadow-lg transition-all ${
                activeMarker.type === 'acerto'
                  ? 'bg-[#081520] border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                  : 'bg-[#1a0c14] border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  {activeMarker.type === 'acerto' ? (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                  )}
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                      activeMarker.type === 'acerto'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {activeMarker.type === 'acerto' ? 'Acerto Tático' : 'Erro de Posicionamento'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  Zona: {activeMarker.zone}
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                <h4 className="text-sm font-bold text-white">
                  {activeMarker.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeMarker.description}
                </p>
              </div>

              {activeMarker.player && (
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Envolvido:</span>
                  <span className="font-bold text-white uppercase">{activeMarker.player}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Clique nos marcadores no campo para detalhar acertos e erros de posicionamento.</span>
            </div>
          )}

          {/* Positional Breakdown Bars */}
          <div className="p-4 rounded-xl bg-[#0a0d16] border border-slate-800 space-y-3 shadow-sm">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300 block">
              Ocupação Territorial dos Terços
            </span>

            {/* Defensive Third */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-medium">Terço Defensivo (Base)</span>
                <span className="font-mono text-[11px] text-sky-300">
                  {player1.playerName}: {p1Def.toFixed(1)}% • {player2.playerName}: {p2Def.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden flex">
                <div style={{ width: `${p1Def}%` }} className="h-full bg-sky-500" />
                <div style={{ width: `${p2Def}%` }} className="h-full bg-amber-500 opacity-80" />
              </div>
            </div>

            {/* Neutral Third */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-medium">Terço Neutro (Meio-Campo)</span>
                <span className="font-mono text-[11px] text-cyan-300">
                  {player1.playerName}: {p1Mid.toFixed(1)}% • {player2.playerName}: {p2Mid.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden flex">
                <div style={{ width: `${p1Mid}%` }} className="h-full bg-cyan-500" />
                <div style={{ width: `${p2Mid}%` }} className="h-full bg-amber-500 opacity-60" />
              </div>
            </div>

            {/* Offensive Third */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-medium">Terço Ofensivo (Ataque)</span>
                <span className="font-mono text-[11px] text-rose-300">
                  {player1.playerName}: {p1Off.toFixed(1)}% • {player2.playerName}: {p2Off.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden flex">
                <div style={{ width: `${p1Off}%` }} className="h-full bg-rose-500" />
                <div style={{ width: `${p2Off}%` }} className="h-full bg-amber-500 opacity-50" />
              </div>
            </div>
          </div>

          {/* Duo Distance and Spatial Symmetry */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[#07090f] border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Distância Média à Bola
              </span>
              <span className="text-sm font-mono font-bold text-white">
                {(p1Pos.avgDistanceToBall || 2200).toFixed(0)} uu / {(p2Pos.avgDistanceToBall || 2400).toFixed(0)} uu
              </span>
              <span className="text-[10px] text-slate-400 block">
                Proximidade de combate
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#07090f] border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                Separação da Dupla
              </span>
              <span className="text-sm font-mono font-bold text-cyan-200">
                {(p1Pos.avgDistanceToTeammate || 3200).toFixed(0)} unidades
              </span>
              <span className="text-[10px] text-slate-400 block">
                Espaçamento de cobertura
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
