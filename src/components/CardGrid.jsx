import React, { useState } from 'react';
import CardCard from './CardCard';
import { Grid, LayoutGrid, List, Sparkles, AlertCircle } from 'lucide-react';

export default function CardGrid({ 
  cards, 
  onSelectCard, 
  onAddToDeck, 
  deckCards, 
  onToggleCollection, 
  collectionCards,
  onToggleCompare,
  compareList
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'compact', 'table'
  const [visibleCount, setVisibleCount] = useState(24);

  const isInDeck = (cardId) => deckCards.some((c) => c.id === cardId);
  const isInCollection = (cardId) => collectionCards.some((c) => c.id === cardId);
  const isInCompare = (cardId) => compareList.some((c) => c.id === cardId);

  const displayedCards = cards.slice(0, visibleCount);

  return (
    <div className="flex-1 space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-slate-100 font-heading">
            Trovate <span className="text-amber-400 font-mono">{cards.length}</span> carte
          </span>
          <span className="text-xs text-slate-400">| Mostrando {displayedCards.length} di {cards.length}</span>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Griglia Standard"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`p-2 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'compact' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Griglia Compatta"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'table' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Tabella Dettagliata"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {cards.length === 0 && (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4 border border-slate-800">
          <AlertCircle className="w-12 h-12 text-amber-500/80 mx-auto animate-bounce" />
          <h3 className="text-lg font-bold text-slate-200">Nessuna carta trovata</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Prova a modificare la ricerca o a resettare i filtri per visualizzare più carte di One Piece e Pokémon.
          </p>
        </div>
      )}

      {/* Grid Display: Standard Grid */}
      {viewMode === 'grid' && cards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayedCards.map((card) => (
            <CardCard
              key={card.id}
              card={card}
              onSelect={onSelectCard}
              onAddToDeck={onAddToDeck}
              isInDeck={isInDeck(card.id)}
              onToggleCollection={onToggleCollection}
              isInCollection={isInCollection(card.id)}
              onToggleCompare={onToggleCompare}
              isInCompare={isInCompare(card.id)}
            />
          ))}
        </div>
      )}

      {/* Compact Grid */}
      {viewMode === 'compact' && cards.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {displayedCards.map((card) => (
            <div
              key={card.id}
              onClick={() => onSelectCard(card)}
              className="group relative glass-panel p-2 rounded-xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:scale-105"
            >
              <div className="aspect-[2.5/3.5] w-full rounded-lg overflow-hidden bg-slate-900 mb-2">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="text-xs font-bold text-slate-200 truncate">{card.name}</div>
              <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono mt-0.5">
                <span>{card.code}</span>
                <span>€{card.marketPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table List View */}
      {viewMode === 'table' && cards.length > 0 && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Carta</th>
                  <th className="p-3">Gioco</th>
                  <th className="p-3">Codice / Set</th>
                  <th className="p-3">Rarità</th>
                  <th className="p-3">Statistiche</th>
                  <th className="p-3 text-right">Prezzo Stimato</th>
                  <th className="p-3 text-center">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {displayedCards.map((card) => (
                  <tr key={card.id} className="hover:bg-slate-900/60 transition-colors">
                    <td 
                      onClick={() => onSelectCard(card)}
                      className="p-3 font-bold text-slate-100 flex items-center gap-3 cursor-pointer hover:text-amber-400"
                    >
                      <img src={card.image} alt={card.name} className="w-8 h-11 object-contain rounded" />
                      <span>{card.name}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        card.game === 'onepiece' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {card.game === 'onepiece' ? 'One Piece' : 'Pokémon'}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-300">{card.code} ({card.set})</td>
                    <td className="p-3 font-mono text-amber-400 font-semibold">{card.rarity}</td>
                    <td className="p-3">
                      {card.game === 'onepiece' ? (
                        <span>PWR {card.power || '-'} | Cost {card.cost || '-'}</span>
                      ) : (
                        <span>HP {card.hp || '-'} | {card.stage || '-'}</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-amber-400">
                      €{card.marketPrice.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onSelectCard(card)}
                        className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition-all text-[11px]"
                      >
                        Vedi Dettagli
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < cards.length && (
        <div className="text-center pt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 24)}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 font-bold text-sm transition-all shadow-lg hover:scale-105"
          >
            Carica altre carte ({cards.length - visibleCount} rimanenti)
          </button>
        </div>
      )}

    </div>
  );
}
