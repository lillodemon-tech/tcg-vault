import React, { useRef } from 'react';
import { Plus, Eye, ArrowLeftRight, Check, Heart } from 'lucide-react';

export default function CardCard({ 
  card, 
  onSelect, 
  onAddToDeck, 
  isInDeck, 
  onToggleCollection, 
  isInCollection,
  onToggleCompare,
  isInCompare
}) {
  const cardRef = useRef(null);

  // 3D Perspective Tilt on Mouse Movement
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    cardRef.current.style.setProperty('--mouse-x', `${percentX}%`);
    cardRef.current.style.setProperty('--mouse-y', `${percentY}%`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  const isOnePiece = card.game === 'onepiece';
  const isChase = card.isChaseCard || card.rarity?.includes('Manga') || card.rarity?.includes('Special Illustration');

  return (
    <div className="group relative card-container select-none">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`card-3d-wrapper rounded-xl overflow-hidden glass-panel border transition-all duration-200 cursor-pointer flex flex-col h-full ${
          isChase ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        {/* Holographic foil glare effect */}
        <div className="holo-glare" />
        {isChase && <div className="rainbow-shimmer" />}

        {/* Card Header Tag / Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
          {/* Game Badge */}
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow ${
            isOnePiece 
              ? 'bg-rose-950/90 text-rose-300 border border-rose-500/40 backdrop-blur'
              : 'bg-amber-950/90 text-amber-300 border border-amber-500/40 backdrop-blur'
          }`}>
            {isOnePiece ? 'One Piece' : 'Pokémon'}
          </span>

          {/* Rarity Tag */}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-950/80 text-amber-400 border border-amber-500/30 backdrop-blur font-mono shadow">
            {card.rarity}
          </span>
        </div>

        {/* Card Artwork Display */}
        <div 
          onClick={() => onSelect(card)}
          className="relative aspect-[2.5/3.5] w-full bg-slate-900 overflow-hidden flex items-center justify-center p-2 group-hover:scale-[1.02] transition-transform duration-300"
        >
          {/* High-Res Card Image */}
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-full object-contain rounded-lg drop-shadow-2xl"
            loading="lazy"
            onError={(e) => {
              // Graceful SVG card placeholder fallback if image URL fails
              e.target.onerror = null;
              e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="300" height="420" fill="%230f172a" rx="16"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="%23f59e0b" font-family="sans-serif" font-size="20" font-weight="bold">${encodeURIComponent(card.name)}</text><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="14">${encodeURIComponent(card.code)}</text></svg>`;
            }}
          />

          {/* Hover Overlay Action Button */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-[2px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(card);
              }}
              className="p-3 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold transition-all shadow-xl hover:scale-110"
              title="Vedi Dettagli Completi"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card Details & Footer */}
        <div className="p-3 bg-slate-950/90 flex-1 flex flex-col justify-between border-t border-slate-800/80">
          <div>
            <div className="flex items-start justify-between gap-1">
              <h3 
                onClick={() => onSelect(card)}
                className="font-bold text-sm text-slate-100 line-clamp-1 hover:text-amber-400 transition-colors cursor-pointer"
              >
                {card.name}
              </h3>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-400 mt-1 font-mono">
              <span>{card.code}</span>
              <span className="text-slate-300 font-semibold">{card.set}</span>
            </div>

            {/* Game Specific Stats Pills */}
            <div className="flex items-center gap-1.5 mt-2">
              {isOnePiece ? (
                <>
                  {card.color && card.color.map((c) => (
                    <span key={c} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {c}
                    </span>
                  ))}
                  {card.power && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono">
                      PWR {card.power.toLocaleString()}
                    </span>
                  )}
                  {card.life && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-400 font-mono">
                      LIFE {card.life}
                    </span>
                  )}
                </>
              ) : (
                <>
                  {card.pokemonType && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {card.pokemonType}
                    </span>
                  )}
                  {card.hp && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">
                      HP {card.hp}
                    </span>
                  )}
                  {card.stage && (
                    <span className="text-[10px] font-medium text-slate-400">
                      {card.stage}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Card Bottom Bar: Market Price & Action Toolbar */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Prezzo Stimato</div>
              <div className="text-sm font-black text-amber-400 font-mono">
                €{card.marketPrice.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Toggle Collection */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCollection(card);
                }}
                className={`p-1.5 rounded-lg border transition-all ${
                  isInCollection
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-emerald-400 hover:border-slate-700'
                }`}
                title={isInCollection ? "In collezione" : "Aggiungi alla Collezione"}
              >
                <Heart className={`w-3.5 h-3.5 ${isInCollection ? 'fill-emerald-400' : ''}`} />
              </button>

              {/* Toggle Compare */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(card);
                }}
                className={`p-1.5 rounded-lg border transition-all ${
                  isInCompare
                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-indigo-400 hover:border-slate-700'
                }`}
                title={isInCompare ? "Rimuovi da confronto" : "Aggiungi a Confronta"}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>

              {/* Add to Deck */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToDeck(card);
                }}
                className={`p-1.5 rounded-lg border transition-all ${
                  isInDeck
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-rose-400 hover:border-slate-700'
                }`}
                title={isInDeck ? "Già nel Mazzo (+1)" : "Aggiungi al Mazzo"}
              >
                {isInDeck ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
