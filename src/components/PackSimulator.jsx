import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BOOSTER_PACKS, INITIAL_CARDS } from '../data/cardsData';
import { Package, Sparkles, RefreshCw, Plus, Check } from 'lucide-react';

export default function PackSimulator({ onAddToCollection, onAddToDeck, onSelectCard }) {
  const [selectedPack, setSelectedPack] = useState(BOOSTER_PACKS[0]);
  const [isOpening, setIsOpening] = useState(false);
  const [openedCards, setOpenedCards] = useState(null);
  const [revealedIndex, setRevealedIndex] = useState(-1);

  const handleOpenPack = () => {
    setIsOpening(true);
    setOpenedCards(null);
    setRevealedIndex(-1);

    setTimeout(() => {
      // Generate randomized pull from cards pool corresponding to game
      const pool = INITIAL_CARDS.filter(c => c.game === selectedPack.game);
      
      // Pick 5 random cards with pull rate probabilities
      const cards = [];
      const numCards = selectedPack.game === 'onepiece' ? 5 : 6;

      for (let i = 0; i < numCards; i++) {
        // High rarity chance on last card
        if (i === numCards - 1) {
          const rareChaseCards = pool.filter(c => c.isChaseCard || c.rarity?.includes('SEC') || c.rarity?.includes('Illustration'));
          if (rareChaseCards.length > 0 && Math.random() < 0.45) {
            cards.push(rareChaseCards[Math.floor(Math.random() * rareChaseCards.length)]);
          } else {
            cards.push(pool[Math.floor(Math.random() * pool.length)]);
          }
        } else {
          cards.push(pool[Math.floor(Math.random() * pool.length)]);
        }
      }

      setOpenedCards(cards);
      setIsOpening(false);
      setRevealedIndex(0);

      // Trigger Confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  const handleRevealNext = () => {
    if (openedCards && revealedIndex < openedCards.length - 1) {
      const nextIdx = revealedIndex + 1;
      setRevealedIndex(nextIdx);

      // Extra confetti for chase cards!
      if (openedCards[nextIdx]?.isChaseCard) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 }
        });
      }
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Pack Selection Cards */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-xl font-extrabold text-white font-heading flex items-center gap-2">
          <Package className="w-6 h-6 text-purple-400" />
          <span>Seleziona Bustina da Aprire</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BOOSTER_PACKS.map((pack) => (
            <div
              key={pack.id}
              onClick={() => {
                setSelectedPack(pack);
                setOpenedCards(null);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedPack.id === pack.id
                  ? 'border-purple-500 bg-purple-950/30 shadow-lg shadow-purple-950/50 scale-105'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className={`aspect-[2/3] w-full rounded-xl bg-gradient-to-tr ${pack.color} p-3 flex flex-col justify-between shadow-inner mb-3`}>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-950/80 text-purple-300 w-fit">
                  {pack.game === 'onepiece' ? 'One Piece TCG' : 'Pokémon TCG'}
                </span>
                <div className="text-center">
                  <div className="text-2xl font-black text-white font-heading">{pack.setName}</div>
                  <div className="text-[10px] text-purple-200 mt-1">{pack.cardCount} Carte per Bustina</div>
                </div>
              </div>

              <div className="font-bold text-sm text-slate-100 line-clamp-1">{pack.name}</div>
              <div className="text-xs text-amber-400 font-mono mt-0.5">€{pack.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pack Opening Stage */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 text-center space-y-6 relative overflow-hidden">
        
        {!openedCards && !isOpening && (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="w-48 h-64 mx-auto rounded-2xl bg-gradient-to-tr from-purple-900 via-indigo-900 to-rose-900 border-2 border-purple-500/50 shadow-2xl flex flex-col items-center justify-center p-4 relative group cursor-pointer" onClick={handleOpenPack}>
              <Sparkles className="w-12 h-12 text-amber-400 animate-pulse mb-2" />
              <span className="font-black text-lg text-white font-heading">{selectedPack.setName}</span>
              <span className="text-xs text-purple-200 mt-1">Clicca per Strappare!</span>
            </div>

            <button
              onClick={handleOpenPack}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-black text-base rounded-2xl shadow-xl shadow-purple-900/50 hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              <span>APRI BUSTINA BOOSTER</span>
            </button>
          </div>
        )}

        {/* Opening Animation State */}
        {isOpening && (
          <div className="py-16 space-y-4 animate-pack-shake">
            <div className="w-48 h-64 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 border-2 border-amber-400 shadow-2xl flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-white animate-spin" />
            </div>
            <div className="text-lg font-black text-amber-400 animate-pulse font-heading">
              Apertura in corso... Preparati al Pull!
            </div>
          </div>
        )}

        {/* Revealed Cards Showcase */}
        {openedCards && (
          <div className="space-y-6">
            <div className="text-xs text-purple-400 font-extrabold uppercase tracking-widest">
              Carta {revealedIndex + 1} di {openedCards.length} Svelata!
            </div>

            <div className="flex flex-col items-center">
              {openedCards[revealedIndex] && (
                <div 
                  onClick={() => onSelectCard(openedCards[revealedIndex])}
                  className={`animate-card-reveal relative aspect-[2.5/3.5] w-full max-w-xs rounded-2xl overflow-hidden glass-panel p-2 border cursor-pointer transition-all ${
                    openedCards[revealedIndex].isChaseCard ? 'border-amber-400 rare-glow-effect' : 'border-slate-700'
                  }`}
                >
                  <img
                    src={openedCards[revealedIndex].image}
                    alt={openedCards[revealedIndex].name}
                    className="w-full h-full object-contain rounded-xl drop-shadow-2xl"
                  />
                  {openedCards[revealedIndex].isChaseCard && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-lg">
                      🔥 TOP PULL!
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-xl font-extrabold text-white">{openedCards[revealedIndex]?.name}</h3>
                <div className="text-xs text-amber-400 font-mono mt-1">
                  {openedCards[revealedIndex]?.rarity} • €{openedCards[revealedIndex]?.marketPrice.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 pt-4">
              {revealedIndex < openedCards.length - 1 ? (
                <button
                  onClick={handleRevealNext}
                  className="px-6 py-3 bg-amber-500 text-slate-950 font-black rounded-xl text-sm hover:bg-amber-400 transition-all shadow-lg"
                >
                  Svela Prossima Carta ({openedCards.length - 1 - revealedIndex} Rimanenti)
                </button>
              ) : (
                <button
                  onClick={handleOpenPack}
                  className="px-6 py-3 bg-purple-600 text-white font-black rounded-xl text-sm hover:bg-purple-500 transition-all shadow-lg flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Apri Un'Altra Bustina</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
