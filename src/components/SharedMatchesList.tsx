'use client';

import React, { useState } from 'react';
import { SharedMatchItem } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { PLAYER_1, PLAYER_2 } from '@/lib/constants';

interface SharedMatchesListProps {
  matches: SharedMatchItem[];
}

export function SharedMatchesList({ matches }: SharedMatchesListProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!matches || matches.length === 0) {
    return null;
  }

  return (
    <Card className="p-3.5 sm:p-4 border-sky-950/70 bg-[#11131a]">
      {/* Header / Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
          <div>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-200">
              Partidas Jogadas Juntos ({matches.length})
            </h2>
            <span className="text-[10px] text-zinc-500 font-medium block">
              Historico cronologico das partidas compartilhadas
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Recolher historico de partidas' : 'Expandir historico de partidas'}
          className="p-1 rounded-md bg-[#181a24] hover:bg-[#202433] text-zinc-400 hover:text-white transition-colors"
          title={isExpanded ? 'Recolher historico' : 'Expandir historico'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Match Cards List */}
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {matches.map((m, idx) => {
            const isWin = m.result === 'win';
            const displayDate = m.formattedDate || m.date;
            return (
              <div
                key={m.id || idx}
                className="p-2.5 sm:p-3 rounded-lg bg-[#141722] border border-[#232736] hover:border-zinc-700 transition-colors"
              >
                {/* Line 1: Date, Map, Result & Placar */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-white truncate text-[11px] sm:text-xs">
                      {m.mapName}
                    </span>
                    <span className="text-[10px] text-zinc-500 hidden sm:inline">
                      • {displayDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono font-bold text-white text-xs sm:text-sm">
                      <span className={isWin ? 'text-emerald-400' : 'text-zinc-300'}>
                        {m.teamGoals}
                      </span>
                      <span className="text-zinc-600 mx-1">x</span>
                      <span className={!isWin ? 'text-rose-400' : 'text-zinc-400'}>
                        {m.opponentGoals}
                      </span>
                    </span>

                    <Badge variant={isWin ? 'win' : 'loss'} className="text-[10px] py-0 px-1.5">
                      {isWin ? 'Vitoria' : 'Derrota'}
                    </Badge>

                    {m.isOvertime && (
                      <span className="text-[9px] px-1 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded font-semibold">
                        OT
                      </span>
                    )}
                  </div>
                </div>

                {/* Line 2: Mobile Date + Individual performance split */}
                <div className="mt-1.5 pt-1.5 border-t border-[#1e2230] flex items-center justify-between text-[10px] sm:text-xs text-zinc-400">
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500 sm:hidden">
                    <Clock className="w-3 h-3" />
                    <span>{displayDate}</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                    {/* Player 1 (Leok07) */}
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sky-400">{PLAYER_1.name}:</span>
                      <span className="text-zinc-300">
                        {m.p1Goals}G {m.p1Assists}A {m.p1Saves}S ({m.p1Score} pts)
                      </span>
                    </div>

                    {/* Player 2 (Theuszrib) */}
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-orange-400">{PLAYER_2.name}:</span>
                      <span className="text-zinc-300">
                        {m.p2Goals}G {m.p2Assists}A {m.p2Saves}S ({m.p2Score} pts)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
