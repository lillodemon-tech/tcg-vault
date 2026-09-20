import React, { useState } from 'react';
import { X, Heart, Plus, ArrowLeftRight, Share2, ShieldCheck, Sparkles, TrendingUp, Copy, Check } from 'lucide-react';

export default function CardModal({ 
  card, 
  onClose, 
  onAddToDeck, 
  isInDeck,
  onToggleCollection,
  isInCollection,
  onToggleCompare,
  isInCompare
}) {
  const [copied, setCopied] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('stats'); // 'stats', 'market', 'legality'

  if (!card) return null;

  const isOnePiece = card.game === 'onepiece';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`${card.name} (${card.code}) - ${card.set}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Card Image Display Column */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative aspect-[2.5/3.5] w-full max-w-xs rounded-2xl overflow-hidden glass-panel p-2 border border-slate-700 shadow-2xl group">
              <div className="holo-glare" />
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-contain rounded-xl drop-shadow-2xl"
              />
            </div>

            {/* Quick Action Buttons Below Image */}
            <div className="flex items-center gap-2 mt-4 w-full justify-center">
              <button
                onClick={() => onAddToDeck(card)}
                className={`flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow ${
                  isInDeck
                    ? 'bg-rose-500 text-white shadow-rose-900/40'
                    : 'bg-gradient-to-r from-rose-600 to-amber-600 text-white hover:opacity-90'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{isInDeck ? 'Nel Mazzo (+1)' : 'Aggiungi al Mazzo'}</span>
              </button>

              <button
                onClick={() => onToggleCollection(card)}
                className={`p-2.5 rounded-xl border transition-all ${
                  isInCollection
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-emerald-400'
                }`}
                title="Collezione"
              >
                <Heart className={`w-5 h-5 ${isInCollection ? 'fill-emerald-400' : ''}`} />
              </button>

              <button
                onClick={() => onToggleCompare(card)}
                className={`p-2.5 rounded-xl border transition-all ${
                  isInCompare
                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-indigo-400'
                }`}
                title="Confronta"
              >
                <ArrowLeftRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Card Info & Details Column */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  isOnePiece ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                }`}>
                  {isOnePiece ? 'One Piece TCG' : 'Pokémon TCG'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900 text-amber-400 border border-amber-500/30 font-mono">
                  {card.rarity}
                </span>
              </div>

              <h2 className="text-2xl font-black text-white font-heading">{card.name}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
                <span>Codice: <strong className="text-slate-200">{card.code}</strong></span>
                <span>Set: <strong className="text-amber-400">{card.set}</strong></span>
                <button
                  onClick={handleCopyCode}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiato!' : 'Copia'}</span>
                </button>
              </div>
            </div>

            {/* Modal Internal Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveModalTab('stats')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeModalTab === 'stats'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Statistiche & Effetti
              </button>
              <button
                onClick={() => setActiveModalTab('market')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  activeModalTab === 'market'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Mercato & Prezzi</span>
              </button>
              <button
                onClick={() => setActiveModalTab('legality')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  activeModalTab === 'legality'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Legalità Tornei</span>
              </button>
            </div>

            {/* Tab 1: Stats & Effects */}
            {activeModalTab === 'stats' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Specific Game Attributes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-xs">
                  {isOnePiece ? (
                    <>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Colore</span>
                        <span className="font-extrabold text-rose-400">{card.color?.join(', ') || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Potenza</span>
                        <span className="font-extrabold text-amber-400 font-mono">{card.power ? `${card.power.toLocaleString()}` : '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Costo</span>
                        <span className="font-extrabold text-slate-200 font-mono">{card.cost ?? '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Counter</span>
                        <span className="font-extrabold text-slate-300 font-mono">{card.counter ? `+${card.counter}` : '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Attributo</span>
                        <span className="font-extrabold text-slate-200">{card.attribute || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Tipo / Frazione</span>
                        <span className="font-extrabold text-amber-300">{card.type || '-'}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Tipo Elemento</span>
                        <span className="font-extrabold text-amber-400">{card.pokemonType || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Punti Vita (HP)</span>
                        <span className="font-extrabold text-emerald-400 font-mono">{card.hp ? `${card.hp} HP` : '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Stadio Evolutivo</span>
                        <span className="font-extrabold text-slate-200">{card.stage || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Debolezza</span>
                        <span className="font-extrabold text-red-400 font-mono">{card.weakness || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Costo Ritirata</span>
                        <span className="font-extrabold text-slate-300 font-mono">{card.retreat ?? '-'} Energia</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Card Rules Effect Text */}
                {card.effect && (
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">Effetto / Testo Regole</span>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{card.effect}</p>
                  </div>
                )}

                {/* Pokémon Attacks */}
                {card.attacks && card.attacks.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">Attacchi</span>
                    {card.attacks.map((atk, idx) => (
                      <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-start justify-between gap-3 text-xs">
                        <div>
                          <div className="font-bold text-slate-100">{atk.name}</div>
                          <div className="text-[11px] text-slate-400">{atk.description}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono font-black text-amber-400 text-sm">{atk.damage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-[11px] text-slate-400 italic">
                  Illustratore: <strong className="text-slate-200 font-normal">{card.illustrator || 'N.D.'}</strong>
                </div>
              </div>
            )}

            {/* Tab 2: Market & Price Analytics */}
            {activeModalTab === 'market' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block uppercase font-bold">Stima Prezzo Attuale</span>
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      €{card.marketPrice.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>In Trend Stabile</span>
                  </span>
                </div>

                {/* Price History Bar Visualization */}
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-300 block">Andamento Storico Prezzi</span>
                  <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
                    {(card.priceHistory || [
                      { date: '2024-03', price: card.marketPrice * 0.85 },
                      { date: '2024-06', price: card.marketPrice * 0.95 },
                      { date: '2024-09', price: card.marketPrice }
                    ]).map((h, i) => {
                      const maxP = Math.max(...(card.priceHistory?.map(p => p.price) || [card.marketPrice]));
                      const heightPercent = Math.max(20, (h.price / (maxP || 1)) * 100);
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                          <span className="text-[10px] font-mono text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            €{h.price}
                          </span>
                          <div 
                            style={{ height: `${heightPercent}%` }} 
                            className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-md transition-all group-hover:brightness-125"
                          />
                          <span className="text-[9px] font-mono text-slate-400">{h.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Tournament Legality */}
            {activeModalTab === 'legality' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Formato Standard Ufficiale</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    card.legalities?.standard === 'Legal'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {card.legalities?.standard || 'Legal'}
                  </span>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Formato Expanded / Unlimited</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    card.legalities?.expanded === 'Legal'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {card.legalities?.expanded || 'Legal'}
                  </span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
