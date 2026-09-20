import React from 'react';
import { EXPANSION_SETS } from '../data/cardsData';
import { FolderOpen, Calendar, Layers, ChevronRight } from 'lucide-react';

export default function SetsExplorer({ onSelectSet, activeGame }) {
  const opSets = EXPANSION_SETS.onepiece;
  const pokSets = EXPANSION_SETS.pokemon;

  return (
    <div className="space-y-8">
      
      {/* One Piece Sets */}
      {(activeGame === 'onepiece' || activeGame === 'all') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-rose-500/30 pb-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-xl font-extrabold text-white font-heading">Espansioni One Piece TCG</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {opSets.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectSet(s.name, 'onepiece')}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all hover:scale-[1.02] space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-950 text-rose-300 font-mono">
                      {s.code}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-100 group-hover:text-amber-400 transition-colors mt-1 font-heading">
                      {s.name}
                    </h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-t border-slate-800 pt-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{s.releaseDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    <span>{s.totalCards} Carte</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pokémon Sets */}
      {(activeGame === 'pokemon' || activeGame === 'all') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 border-b border-amber-500/30 pb-3">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <h2 className="text-xl font-extrabold text-white font-heading">Espansioni Pokémon TCG</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {pokSets.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectSet(s.name, 'pokemon')}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:scale-[1.02] space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-950 text-amber-300 font-mono">
                      {s.code}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-100 group-hover:text-amber-400 transition-colors mt-1 font-heading">
                      {s.name}
                    </h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-t border-slate-800 pt-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{s.releaseDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    <span>{s.totalCards} Carte</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
