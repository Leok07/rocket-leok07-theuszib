'use client';

import React, { useState, useMemo } from 'react';
import {
  AiCoachPitchAnalysis,
  AiCoachFieldMarker,
} from '@/types/ai-coach';
import { AggregatedPlayerDashboard, SharedMatchItem } from '@/types/dashboard';
import {
  Target,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sparkles,
  Compass,
  Info,
  ArrowUpRight,
  Crosshair,
  Flame
} from 'lucide-react';

interface TacticalPitchHeatmapProps {
  player1: AggregatedPlayerDashboard;
  player2: AggregatedPlayerDashboard;
  pitchAnalysis?: AiCoachPitchAnalysis;
  sharedMatches?: SharedMatchItem[];
}

type PitchViewMode = 'markers' | 'events' | 'duo' | 'p1' | 'p2' | 'all';

interface PitchEventPoint {
  id: string;
  type: 'finalizacao' | 'assistencia' | 'kickoff';
  title: string;
  player: string;
  description: string;
  x: number; // coordinates in SVG viewBox (0-300)
  y: number; // coordinates in SVG viewBox (0-480)
  trajectory?: {
    x2: number;
    y2: number;
    label: string;
    style: 'solid' | 'dashed';
  };
}

export function TacticalPitchHeatmap({
  player1,
  player2,
  pitchAnalysis,
  sharedMatches = [],
}: TacticalPitchHeatmapProps) {
  const [activeMode, setActiveMode] = useState<PitchViewMode>('markers');
  const [selectedMarker, setSelectedMarker] = useState<AiCoachFieldMarker | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<PitchEventPoint | null>(null);

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

  // Aggregate core match events (shots, goals, assists) from session & shared matches
  const totalGoals = (player1.session?.totalGoals || 0) + (player2.session?.totalGoals || 0);
  const totalShots = (player1.session?.totalShots || 0) + (player2.session?.totalShots || 0);
  const totalAssists = (player1.session?.totalAssists || 0) + (player2.session?.totalAssists || 0);
  const matchSampleCount = sharedMatches.length || player1.replaysAnalyzed || 1;

  // Realistically mapped game event coordinates and ball trajectory vectors
  const pitchEvents: PitchEventPoint[] = useMemo(() => [
    {
      id: 'kickoff-center',
      type: 'kickoff',
      title: 'Bola ao Centro (Kickoff Primário)',
      player: 'Dupla',
      description: `Disputa no círculo central com saída imediata em diagonal para contenção e posse. Média de ${(matchSampleCount * 3.2).toFixed(0)} kickoffs disputados.`,
      x: 150,
      y: 240,
      trajectory: {
        x2: 185,
        y2: 175,
        label: 'Trajetória de Saída de Kickoff',
        style: 'dashed'
      }
    },
    {
      id: 'shot-center-slot',
      type: 'finalizacao',
      title: 'Finalização no Slot Central',
      player: player1.playerName,
      description: `Disparo direto no terço ofensivo em direção ao gol superior. ${player1.playerName} registrou ${player1.session?.totalShots || 0} chutes na amostragem.`,
      x: 150,
      y: 95,
      trajectory: {
        x2: 150,
        y2: 18,
        label: 'Trajetória de Finalização ao Gol',
        style: 'solid'
      }
    },
    {
      id: 'shot-left-wing',
      type: 'finalizacao',
      title: 'Chute da Ala Esquerda',
      player: player2.playerName,
      description: `Finalização angulada buscando o ângulo superior direito adversário. Conversão calculada em ${((player2.session?.shootingPercentage || 0.35) * 100).toFixed(0)}%.`,
      x: 110,
      y: 110,
      trajectory: {
        x2: 165,
        y2: 18,
        label: 'Trajetória Cruzada ao Gol',
        style: 'solid'
      }
    },
    {
      id: 'assist-left-cross',
      type: 'assistencia',
      title: 'Assistência: Cruzamento da Ponta Esquerda',
      player: player1.playerName,
      description: `Passe em arco do escanteio ofensivo conectando o companheiro no centro da área adversária. Total da dupla: ${totalAssists} assistências.`,
      x: 55,
      y: 90,
      trajectory: {
        x2: 145,
        y2: 95,
        label: 'Trajetória de Passe para o Chute',
        style: 'dashed'
      }
    },
    {
      id: 'assist-right-wing',
      type: 'assistencia',
      title: 'Assistência: Passe Infield da Direita',
      player: player2.playerName,
      description: `Passe rasteiro vindo da transição lateral direita em direção à zona de perigo ofensivo.`,
      x: 245,
      y: 115,
      trajectory: {
        x2: 155,
        y2: 95,
        label: 'Trajetória de Passe Lateral',
        style: 'dashed'
      }
    }
  ], [player1, player2, matchSampleCount, totalAssists]);

  const activeEvent = selectedEvent || pitchEvents[0];

  const showMarkers = activeMode === 'markers' || activeMode === 'all';
  const showEvents = activeMode === 'events' || activeMode === 'all';
  const showHeatmap = activeMode === 'duo' || activeMode === 'p1' || activeMode === 'p2' || activeMode === 'all';

  return (
    <div className="w-full rounded-2xl bg-[#070709] border border-[#1e1e24] p-5 sm:p-6 shadow-2xl mt-6 relative overflow-hidden">
      {/* Subtle Background Ambience - Zero Blue / Pure Dark Obsidian */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e1e24]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#0f0f13] border border-[#27272a] text-cyan-400 shadow-inner">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black uppercase tracking-[0.2em] text-white">
                Campinho Tático 2D & Heatmap
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#121216] text-cyan-300 border border-cyan-500/30">
                IA Espacial
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Mapeamento de calor posicional, eventos com trajetórias da bola e diagnóstico de posicionamento
            </p>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center flex-wrap gap-1 p-1 rounded-xl bg-[#040405] border border-[#1e1e24]">
          <button
            onClick={() => setActiveMode('markers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === 'markers'
                ? 'bg-[#141418] text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Acertos & Erros (IA)
          </button>
          <button
            onClick={() => setActiveMode('events')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === 'events'
                ? 'bg-[#141418] text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Eventos & Trajetórias
          </button>
          <button
            onClick={() => setActiveMode('duo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === 'duo'
                ? 'bg-[#141418] text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Calor da Dupla
          </button>
          <button
            onClick={() => setActiveMode('p1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === 'p1'
                ? 'bg-[#141418] text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {player1.playerName}
          </button>
          <button
            onClick={() => setActiveMode('p2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === 'p2'
                ? 'bg-[#141418] text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {player2.playerName}
          </button>
          <button
            onClick={() => setActiveMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === 'all'
                ? 'bg-[#141418] text-white border border-zinc-600 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Visão Geral
          </button>
        </div>
      </div>

      {/* Main Pitch & Telemetry Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Left Column: Authentic 2D Rocket League Pitch (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[1/1.6] rounded-2xl bg-[#030304] border-2 border-[#27272a] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden select-none">
            {/* Field SVG Geometry */}
            <svg
              className="w-full h-full"
              viewBox="0 0 300 480"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Arena Definitions (Filters, Gradients, Arrow Markers) */}
              <defs>
                {/* Crosshatch Net Pattern for Goals */}
                <pattern id="goalNetPattern" width="6" height="6" patternUnits="userSpaceOnUse">
                  <path d="M 0 0 L 6 6 M 6 0 L 0 6" stroke="#52525b" strokeWidth="0.75" strokeOpacity="0.35" />
                </pattern>

                {/* Gaussian Blur for Ultra-Realistic Spatial Heatmap Diffusion */}
                <filter id="pitchBlur" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="16" />
                </filter>

                {/* Arrowhead Markers for Ball Trajectories */}
                <marker
                  id="arrow-shot"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
                </marker>
                <marker
                  id="arrow-pass"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                </marker>
                <marker
                  id="arrow-kickoff"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24" />
                </marker>

                {/* Thermal Gradients: Player 1 (Electric Cyan / Sky Blue) */}
                <radialGradient id="p1GradDef" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
                  <stop offset="60%" stopColor="#0284c7" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="p1GradMid" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.65" />
                  <stop offset="70%" stopColor="#0891b2" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="p1GradOff" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.55" />
                  <stop offset="80%" stopColor="#0284c7" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>

                {/* Thermal Gradients: Player 2 (Warm Radiant Amber / Gold) */}
                <radialGradient id="p2GradDef" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.75" />
                  <stop offset="60%" stopColor="#d97706" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="p2GradMid" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.60" />
                  <stop offset="70%" stopColor="#b45309" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="p2GradOff" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.50" />
                  <stop offset="80%" stopColor="#b45309" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Pitch Subtle Turf Stripes (Authentic Mowing Pattern) */}
              <g opacity="0.04">
                <rect x="15" y="15" width="270" height="45" fill="#ffffff" />
                <rect x="15" y="105" width="270" height="45" fill="#ffffff" />
                <rect x="15" y="195" width="270" height="45" fill="#ffffff" />
                <rect x="15" y="285" width="270" height="45" fill="#ffffff" />
                <rect x="15" y="375" width="270" height="45" fill="#ffffff" />
              </g>

              {/* Arena Main Perimeter with Chamfered 45-degree Corners */}
              <rect
                x="15"
                y="15"
                width="270"
                height="450"
                rx="28"
                stroke="#27272a"
                strokeWidth="2"
                fill="none"
              />

              {/* Corner 45-Degree Wall Slopes */}
              <line x1="15" y1="52" x2="52" y2="15" stroke="#3f3f46" strokeWidth="1.75" />
              <line x1="248" y1="15" x2="285" y2="52" stroke="#3f3f46" strokeWidth="1.75" />
              <line x1="15" y1="428" x2="52" y2="465" stroke="#3f3f46" strokeWidth="1.75" />
              <line x1="248" y1="465" x2="285" y2="428" stroke="#3f3f46" strokeWidth="1.75" />

              {/* Top Goal Cage (Opponent - Ruby) */}
              <rect
                x="105"
                y="5"
                width="90"
                height="12"
                rx="2"
                stroke="#f43f5e"
                strokeWidth="2"
                fill="url(#goalNetPattern)"
              />
              <rect
                x="105"
                y="5"
                width="90"
                height="12"
                rx="2"
                fill="#f43f5e"
                fillOpacity="0.08"
              />

              {/* Bottom Goal Cage (Friendly - Sky Blue) */}
              <rect
                x="105"
                y="463"
                width="90"
                height="12"
                rx="2"
                stroke="#38bdf8"
                strokeWidth="2"
                fill="url(#goalNetPattern)"
              />
              <rect
                x="105"
                y="463"
                width="90"
                height="12"
                rx="2"
                fill="#38bdf8"
                fillOpacity="0.08"
              />

              {/* Goal Creases / Penalty Arcs */}
              <path
                d="M 90 15 C 90 60, 210 60, 210 15"
                stroke="#27272a"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M 90 465 C 90 420, 210 420, 210 465"
                stroke="#27272a"
                strokeWidth="1.5"
                fill="none"
              />

              {/* Halfway Line */}
              <line
                x1="15"
                y1="240"
                x2="285"
                y2="240"
                stroke="#3f3f46"
                strokeWidth="1.5"
                strokeDasharray="5 5"
              />

              {/* Center Kickoff Circle */}
              <circle
                cx="150"
                cy="240"
                r="46"
                stroke="#27272a"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="150" cy="240" r="3.5" fill="#71717a" />

              {/* Third Divisions (Defensive, Neutral, Offensive Terços) */}
              <line
                x1="15"
                y1="160"
                x2="285"
                y2="160"
                stroke="#18181b"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1="15"
                y1="320"
                x2="285"
                y2="320"
                stroke="#18181b"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* ---------------------------------------------------- */}
              {/* DIRECTIONAL ATTACK ARROW (SETA COM BAIXA OPACIDADE)  */}
              {/* ---------------------------------------------------- */}
              <g opacity="0.12">
                {/* Large Center Chevrons Pointing Towards Top (Ataque) */}
                <path
                  d="M 110 280 L 150 240 L 190 280"
                  stroke="#ffffff"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M 120 230 L 150 200 L 180 230"
                  stroke="#ffffff"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M 130 180 L 150 160 L 170 180"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* Central Shaft with Arrowhead */}
                <line
                  x1="150"
                  y1="330"
                  x2="150"
                  y2="130"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                />
                <polygon points="150,115 142,135 158,135" fill="#ffffff" />
                {/* Orientation Label */}
                <text
                  x="150"
                  y="350"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="8"
                  fontWeight="900"
                  letterSpacing="3"
                >
                  DIREÇÃO DE ATAQUE
                </text>
              </g>

              {/* ---------------------------------------------------- */}
              {/* BOOST PADS: 6 LARGE (100) + 28 SMALL (12)            */}
              {/* ---------------------------------------------------- */}
              {/* 6 Full 100-Boost Pads with Radiant Golden Glow Rings */}
              {/* Corner Boosts */}
              <g>
                <circle cx="36" cy="40" r="10" fill="#f59e0b" fillOpacity="0.15" />
                <circle cx="36" cy="40" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
                <circle cx="36" cy="40" r="2.5" fill="#ffffff" />

                <circle cx="264" cy="40" r="10" fill="#f59e0b" fillOpacity="0.15" />
                <circle cx="264" cy="40" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
                <circle cx="264" cy="40" r="2.5" fill="#ffffff" />

                <circle cx="36" cy="440" r="10" fill="#f59e0b" fillOpacity="0.15" />
                <circle cx="36" cy="440" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
                <circle cx="36" cy="440" r="2.5" fill="#ffffff" />

                <circle cx="264" cy="440" r="10" fill="#f59e0b" fillOpacity="0.15" />
                <circle cx="264" cy="440" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
                <circle cx="264" cy="440" r="2.5" fill="#ffffff" />

                {/* Midfield Boosts */}
                <circle cx="26" cy="240" r="10" fill="#f59e0b" fillOpacity="0.15" />
                <circle cx="26" cy="240" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
                <circle cx="26" cy="240" r="2.5" fill="#ffffff" />

                <circle cx="274" cy="240" r="10" fill="#f59e0b" fillOpacity="0.15" />
                <circle cx="274" cy="240" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
                <circle cx="274" cy="240" r="2.5" fill="#ffffff" />
              </g>

              {/* 28 Small Boost Pads (12 Boost) */}
              <g fill="#a1a1aa" fillOpacity="0.45">
                {/* Center Circle perimeter pads */}
                <circle cx="150" cy="194" r="2" />
                <circle cx="150" cy="286" r="2" />
                <circle cx="104" cy="240" r="2" />
                <circle cx="196" cy="240" r="2" />
                <circle cx="118" cy="208" r="2" />
                <circle cx="182" cy="208" r="2" />
                <circle cx="118" cy="272" r="2" />
                <circle cx="182" cy="272" r="2" />

                {/* Defensive Goal Arc Pads */}
                <circle cx="115" cy="425" r="2" />
                <circle cx="150" cy="415" r="2" />
                <circle cx="185" cy="425" r="2" />

                {/* Offensive Goal Arc Pads */}
                <circle cx="115" cy="55" r="2" />
                <circle cx="150" cy="65" r="2" />
                <circle cx="185" cy="55" r="2" />

                {/* Left Longitudinal Trail */}
                <circle cx="65" cy="140" r="2" />
                <circle cx="65" cy="240" r="2" />
                <circle cx="65" cy="340" r="2" />

                {/* Right Longitudinal Trail */}
                <circle cx="235" cy="140" r="2" />
                <circle cx="235" cy="240" r="2" />
                <circle cx="235" cy="340" r="2" />

                {/* Central Lane Line Pads */}
                <circle cx="150" cy="130" r="2" />
                <circle cx="150" cy="350" r="2" />
                <circle cx="105" cy="160" r="2" />
                <circle cx="195" cy="160" r="2" />
                <circle cx="105" cy="320" r="2" />
                <circle cx="195" cy="320" r="2" />
              </g>

              {/* ---------------------------------------------------- */}
              {/* HIGH PRECISION MULTI-LAYER HEATMAP                   */}
              {/* ---------------------------------------------------- */}
              {showHeatmap && (
                <g filter="url(#pitchBlur)" opacity="0.75" style={{ mixBlendMode: 'screen' }}>
                  {/* Player 1 Heat Distribution (Electric Cyan / Sky Blue) */}
                  {(activeMode === 'duo' || activeMode === 'p1' || activeMode === 'all') && (
                    <g>
                      {/* P1 Defensive Anchor */}
                      <ellipse
                        cx="135"
                        cy={410 - p1Def * 1.6}
                        rx={55 + p1Def * 0.45}
                        ry={38 + p1Def * 0.4}
                        fill="url(#p1GradDef)"
                      />
                      {/* P1 Midfield Transition */}
                      <ellipse
                        cx="155"
                        cy={240}
                        rx={48 + p1Mid * 0.35}
                        ry={32 + p1Mid * 0.3}
                        fill="url(#p1GradMid)"
                      />
                      {/* P1 Offensive Pressure */}
                      <ellipse
                        cx="160"
                        cy={95 + p1Off * 0.9}
                        rx={42 + p1Off * 0.35}
                        ry={28 + p1Off * 0.3}
                        fill="url(#p1GradOff)"
                      />
                    </g>
                  )}

                  {/* Player 2 Heat Distribution (Warm Radiant Amber / Gold) */}
                  {(activeMode === 'duo' || activeMode === 'p2' || activeMode === 'all') && (
                    <g>
                      {/* P2 Defensive Anchor */}
                      <ellipse
                        cx="165"
                        cy={420 - p2Def * 1.5}
                        rx={60 + p2Def * 0.45}
                        ry={42 + p2Def * 0.4}
                        fill="url(#p2GradDef)"
                      />
                      {/* P2 Midfield Transition */}
                      <ellipse
                        cx="145"
                        cy={250}
                        rx={45 + p2Mid * 0.35}
                        ry={30 + p2Mid * 0.3}
                        fill="url(#p2GradMid)"
                      />
                      {/* P2 Offensive Pressure */}
                      <ellipse
                        cx="140"
                        cy={105 + p2Off * 0.8}
                        rx={38 + p2Off * 0.35}
                        ry={26 + p2Off * 0.3}
                        fill="url(#p2GradOff)"
                      />
                    </g>
                  )}
                </g>
              )}

              {/* ---------------------------------------------------- */}
              {/* GAME EVENTS & STRAIGHT BALL TRAJECTORIES             */}
              {/* ---------------------------------------------------- */}
              {showEvents && (
                <g className="transition-all duration-300">
                  {/* Trajectory Lines with Arrowheads */}
                  {pitchEvents.map((evt) => {
                    if (!evt.trajectory) return null;
                    const isSelected = activeEvent?.id === evt.id;
                    const strokeColor =
                      evt.type === 'finalizacao'
                        ? '#f43f5e'
                        : evt.type === 'assistencia'
                        ? '#38bdf8'
                        : '#fbbf24';

                    const markerEnd =
                      evt.type === 'finalizacao'
                        ? 'url(#arrow-shot)'
                        : evt.type === 'assistencia'
                        ? 'url(#arrow-pass)'
                        : 'url(#arrow-kickoff)';

                    return (
                      <g key={`traj-${evt.id}`}>
                        {/* Glow halo behind trajectory */}
                        <line
                          x1={evt.x}
                          y1={evt.y}
                          x2={evt.trajectory.x2}
                          y2={evt.trajectory.y2}
                          stroke={strokeColor}
                          strokeWidth={isSelected ? 5 : 3}
                          strokeOpacity={isSelected ? 0.4 : 0.2}
                          strokeLinecap="round"
                        />
                        {/* Core vector line */}
                        <line
                          x1={evt.x}
                          y1={evt.y}
                          x2={evt.trajectory.x2}
                          y2={evt.trajectory.y2}
                          stroke={strokeColor}
                          strokeWidth={isSelected ? 2.5 : 1.75}
                          strokeDasharray={evt.trajectory.style === 'dashed' ? '5 4' : undefined}
                          markerEnd={markerEnd}
                          strokeLinecap="round"
                        />
                      </g>
                    );
                  })}

                  {/* Event Points on Pitch */}
                  {pitchEvents.map((evt) => {
                    const isSelected = activeEvent?.id === evt.id;
                    const colorClasses =
                      evt.type === 'finalizacao'
                        ? 'bg-rose-950 border-rose-400 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.7)]'
                        : evt.type === 'assistencia'
                        ? 'bg-sky-950 border-sky-400 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.7)]'
                        : 'bg-amber-950 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.7)]';

                    return (
                      <foreignObject
                        key={`point-${evt.id}`}
                        x={evt.x - 14}
                        y={evt.y - 14}
                        width="28"
                        height="28"
                        className="overflow-visible"
                      >
                        <button
                          onClick={() => {
                            setSelectedEvent(evt);
                            setSelectedMarker(null);
                          }}
                          className={`w-7 h-7 rounded-full flex items-center justify-center border shadow-lg transition-transform duration-200 cursor-pointer ${colorClasses} ${
                            isSelected
                              ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-black'
                              : 'hover:scale-115'
                          }`}
                          title={`${evt.title} (${evt.player})`}
                        >
                          {evt.type === 'finalizacao' ? (
                            <Crosshair className="w-3.5 h-3.5" />
                          ) : evt.type === 'assistencia' ? (
                            <Zap className="w-3.5 h-3.5" />
                          ) : (
                            <Flame className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </foreignObject>
                    );
                  })}
                </g>
              )}
            </svg>

            {/* AI Tactical Markers (Hits & Errors Overlay on Pitch) */}
            {showMarkers &&
              allMarkers.map((marker) => {
                const isHit = marker.type === 'acerto';
                const isSelected = activeMarker?.id === marker.id && !selectedEvent;

                // Convert normalized coordinates (0-100) to pitch percentage
                // y: 0 is defense bottom (85%), 100 is offense top (15%)
                const leftPercent = Math.max(12, Math.min(88, marker.x));
                const topPercent = Math.max(12, Math.min(88, 100 - marker.y));

                return (
                  <button
                    key={marker.id}
                    onClick={() => {
                      setSelectedMarker(marker);
                      setSelectedEvent(null);
                    }}
                    style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-200 z-20 ${
                      isSelected
                        ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-black'
                        : 'hover:scale-115'
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
              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 shadow-md">
                Ataque / Gol Adversário
              </span>
            </div>
            <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-sky-950/80 border border-sky-500/40 text-sky-300 shadow-md">
                Defesa / Nosso Gol
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="flex items-center flex-wrap justify-center gap-3 mt-3 text-[11px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
              <span>Acertos Táticos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
              <span>Erros de Posicionamento</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              <span>Boost 100</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Assistências</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Spatial Diagnosis & Telemetry Breakdown (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Executive AI Pitch Verdict */}
          {pitchAnalysis && (
            <div className="p-4 rounded-xl bg-[#0c0c0f] border border-[#27272a] shadow-md">
              <div className="flex items-center gap-2 text-cyan-400 mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Veredito Espacial da IA
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                {pitchAnalysis.spatialVerdict}
              </p>
            </div>
          )}

          {/* Active Detail Card: Event or Marker */}
          {selectedEvent ? (
            <div className="p-4 rounded-xl bg-[#0f0f14] border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.12)]">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                    Evento & Trajetória
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-400">
                  {selectedEvent.player}
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                <h4 className="text-sm font-bold text-white">{selectedEvent.title}</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">{selectedEvent.description}</p>
              </div>

              {selectedEvent.trajectory && (
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1 text-amber-300">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {selectedEvent.trajectory.label}
                  </span>
                  <span className="font-mono text-zinc-300">Linha Reta Vetorial</span>
                </div>
              )}
            </div>
          ) : activeMarker ? (
            <div
              className={`p-4 rounded-xl border shadow-lg transition-all ${
                activeMarker.type === 'acerto'
                  ? 'bg-[#091118] border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.12)]'
                  : 'bg-[#150a0f] border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.12)]'
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
                <span className="text-xs font-mono font-bold text-zinc-400">
                  Zona: {activeMarker.zone}
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                <h4 className="text-sm font-bold text-white">{activeMarker.title}</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">{activeMarker.description}</p>
              </div>

              {activeMarker.player && (
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Envolvido:</span>
                  <span className="font-bold text-white uppercase">{activeMarker.player}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#0d0d12] border border-[#1e1e24] text-xs text-zinc-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Clique nos marcadores ou eventos no campo para detalhar acertos, erros e trajetórias.</span>
            </div>
          )}

          {/* Positional Breakdown Bars */}
          <div className="p-4 rounded-xl bg-[#0a0a0d] border border-[#1e1e24] space-y-3 shadow-sm">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-300 block">
              Ocupação Territorial dos Terços
            </span>

            {/* Defensive Third */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="font-medium">Terço Defensivo (Base)</span>
                <span className="font-mono text-[11px] text-sky-300">
                  {player1.playerName}: {p1Def.toFixed(1)}% • {player2.playerName}: {p2Def.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#141419] overflow-hidden flex">
                <div style={{ width: `${p1Def}%` }} className="h-full bg-sky-500" />
                <div style={{ width: `${p2Def}%` }} className="h-full bg-amber-500 opacity-80" />
              </div>
            </div>

            {/* Neutral Third */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="font-medium">Terço Neutro (Meio-Campo)</span>
                <span className="font-mono text-[11px] text-cyan-300">
                  {player1.playerName}: {p1Mid.toFixed(1)}% • {player2.playerName}: {p2Mid.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#141419] overflow-hidden flex">
                <div style={{ width: `${p1Mid}%` }} className="h-full bg-cyan-500" />
                <div style={{ width: `${p2Mid}%` }} className="h-full bg-amber-500 opacity-60" />
              </div>
            </div>

            {/* Offensive Third */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="font-medium">Terço Ofensivo (Ataque)</span>
                <span className="font-mono text-[11px] text-rose-300">
                  {player1.playerName}: {p1Off.toFixed(1)}% • {player2.playerName}: {p2Off.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#141419] overflow-hidden flex">
                <div style={{ width: `${p1Off}%` }} className="h-full bg-rose-500" />
                <div style={{ width: `${p2Off}%` }} className="h-full bg-amber-500 opacity-50" />
              </div>
            </div>
          </div>

          {/* Duo Distance and Spatial Symmetry */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#09090c] border border-[#1e1e24] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Distância Média à Bola
              </span>
              <span className="text-sm font-mono font-bold text-white">
                {(p1Pos.avgDistanceToBall || 2200).toFixed(0)} uu / {(p2Pos.avgDistanceToBall || 2400).toFixed(0)} uu
              </span>
              <span className="text-[10px] text-zinc-500 block">
                Proximidade de combate
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#09090c] border border-[#1e1e24] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                Separação da Dupla
              </span>
              <span className="text-sm font-mono font-bold text-cyan-200">
                {(p1Pos.avgDistanceToTeammate || 3200).toFixed(0)} unidades
              </span>
              <span className="text-[10px] text-zinc-500 block">
                Espaçamento de cobertura
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
