'use client';

import React from 'react';
import { PLAYER_1, PLAYER_2 } from '@/lib/constants';
import { RefreshCw } from 'lucide-react';

interface CompareHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  p1Matches: number;
  p2Matches: number;
}

export function CompareHeader({
  onRefresh,
  isLoading,
  p1Matches,
  p2Matches,
}: CompareHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#090a0f]/95 backdrop-blur-md border-b border-[#232736] px-4 sm:px-8 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Player 1 (Leok07 - Blue) */}
        <div className="flex-1 flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-sky-950 border border-sky-600/60 flex items-center justify-center text-sky-400 font-black text-xs sm:text-sm shadow-[0_0_12px_rgba(2,132,199,0.3)] shrink-0">
            {PLAYER_1.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-sky-400 truncate block">
                {PLAYER_1.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-400 truncate">
              <span className="font-semibold text-sky-300/90">{p1Matches} partidas</span>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <span className="text-zinc-500 hidden sm:inline">{PLAYER_1.platformLabel}</span>
            </div>
          </div>
        </div>

        {/* Central Controls / VS / Total Badge */}
        <div className="flex flex-col items-center justify-center shrink-0 px-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#181a24] border border-[#2c3245] text-[10px] sm:text-xs font-black tracking-widest text-zinc-300">
              VS
            </span>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Atualizar Estatisticas"
              aria-label="Atualizar estatisticas"
              aria-busy={isLoading}
              className="p-1.5 rounded-md bg-[#181a24] hover:bg-[#232736] border border-[#2c3245] text-zinc-300 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
            </button>
          </div>

          <span className="text-[9px] text-zinc-400 font-semibold tracking-wider uppercase mt-0.5">
            2v2 Duplas
          </span>
        </div>

        {/* Player 2 (Theuszrib - Orange) */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3 text-right">
          <div className="min-w-0">
            <div className="flex items-center justify-end gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-orange-400 truncate block">
                {PLAYER_2.name}
              </span>
            </div>
            <div className="flex items-center justify-end gap-1 text-[10px] sm:text-xs text-zinc-400 truncate">
              <span className="text-zinc-500 hidden sm:inline">{PLAYER_2.platformLabel}</span>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <span className="font-semibold text-orange-300/90">{p2Matches} partidas</span>
            </div>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-orange-950 border border-orange-600/60 flex items-center justify-center text-orange-400 font-black text-xs sm:text-sm shadow-[0_0_12px_rgba(234,88,12,0.3)] shrink-0">
            {PLAYER_2.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
