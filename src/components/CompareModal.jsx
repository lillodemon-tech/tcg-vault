import React from 'react';
import { X, ArrowLeftRight, Trash2 } from 'lucide-react';

export default function CompareModal({ compareList, onRemoveFromCompare, onClose }) {
  if (!compareList || compareList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-slate-700 p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-extrabold text-white font-heading">Confronto Carte Affiancato ({compareList.length}/4)</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-${Math.min(4, compareList.length)} gap-4`}>
          {compareList.map((card) => (
            <div key={card.id} className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 relative">
              <button
                onClick={() => onRemoveFromCompare(card.id)}
                className="absolute top-2 right-2 p-1.5 bg-slate-900 text-slate-400 hover:text-red-400 rounded-lg"
                title="Rimuovi"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="aspect-[2.5/3.5] w-full rounded-xl overflow-hidden bg-slate-900 mb-2">
                <img src={card.image} alt={card.name} className="w-full h-full object-contain" />
              </div>

              <div className="font-bold text-sm text-slate-100">{card.name}</div>
              <div className="text-xs text-amber-400 font-mono">{card.code}</div>

              <div className="space-y-1.5 text-xs border-t border-slate-800 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Gioco:</span>
                  <span className="font-bold text-slate-200 uppercase">{card.game}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rarità:</span>
                  <span className="font-bold text-amber-400 font-mono">{card.rarity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Potenza / HP:</span>
                  <span className="font-bold text-emerald-400 font-mono">{card.power || card.hp || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Costo:</span>
                  <span className="font-bold text-slate-200 font-mono">{card.cost ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Prezzo Stimato:</span>
                  <span className="font-black text-amber-400 font-mono">€{card.marketPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
