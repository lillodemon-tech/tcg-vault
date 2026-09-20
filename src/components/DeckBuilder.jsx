import React, { useState } from 'react';
import { Trash2, Download, Upload, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, Copy, Check } from 'lucide-react';

export default function DeckBuilder({ deckCards, setDeckCards, activeGame, onSelectCard }) {
  const [deckName, setDeckName] = useState('Il Mio Deck Personalizzato');
  const [copiedText, setCopiedText] = useState(false);

  // Separate Leader, DON!!, and Main deck for One Piece
  const leaderCard = deckCards.find(c => c.game === 'onepiece' && c.category === 'Leader');
  const donCards = deckCards.filter(c => c.game === 'onepiece' && c.category === 'DON!!');
  const mainDeckCards = deckCards.filter(c => !(c.game === 'onepiece' && (c.category === 'Leader' || c.category === 'DON!!')));

  const totalCardCount = deckCards.reduce((acc, c) => acc + (c.quantity || 1), 0);
  const totalMainCount = mainDeckCards.reduce((acc, c) => acc + (c.quantity || 1), 0);
  const totalDonCount = donCards.reduce((acc, c) => acc + (c.quantity || 1), 0);
  const totalPrice = deckCards.reduce((acc, c) => acc + (c.marketPrice * (c.quantity || 1)), 0);

  // Validation Checkers
  const isOnePieceDeck = activeGame === 'onepiece' || (leaderCard && leaderCard.game === 'onepiece');
  
  const validateOnePiece = () => {
    const errors = [];
    if (!leaderCard) errors.push('Manca 1 Carta Leader (Obbligatoria per One Piece).');
    if (totalMainCount !== 50) errors.push(`Il mazzo principale deve avere esattamente 50 carte (Attuale: ${totalMainCount}).`);
    if (totalDonCount !== 10) errors.push(`Devi avere esattamente 10 carte DON!! (Attuale: ${totalDonCount}).`);
    
    // Copy limit check (max 4 per card code)
    const overLimit = deckCards.filter(c => c.category !== 'DON!!' && (c.quantity || 1) > 4);
    if (overLimit.length > 0) {
      errors.push(`Massimo 4 copie per carta superato per: ${overLimit.map(c => c.name).join(', ')}.`);
    }

    return errors;
  };

  const validatePokemon = () => {
    const errors = [];
    if (totalCardCount !== 60) errors.push(`Il mazzo Pokémon deve avere esattamente 60 carte (Attuale: ${totalCardCount}).`);
    const overLimit = deckCards.filter(c => c.category !== 'Energy' && (c.quantity || 1) > 4);
    if (overLimit.length > 0) {
      errors.push(`Massimo 4 copie per carta superato per: ${overLimit.map(c => c.name).join(', ')}.`);
    }
    return errors;
  };

  const validationErrors = isOnePieceDeck ? validateOnePiece() : validatePokemon();
  const isValidDeck = validationErrors.length === 0;

  const updateQuantity = (cardId, delta) => {
    setDeckCards(prev => {
      return prev.map(c => {
        if (c.id === cardId) {
          const newQ = (c.quantity || 1) + delta;
          return newQ > 0 ? { ...c, quantity: newQ } : null;
        }
        return c;
      }).filter(Boolean);
    });
  };

  const removeCard = (cardId) => {
    setDeckCards(prev => prev.filter(c => c.id !== cardId));
  };

  const clearDeck = () => {
    if (window.confirm('Sei sicuro di voler svuotare l\'intero mazzo?')) {
      setDeckCards([]);
    }
  };

  const exportDeckText = () => {
    let text = `// ${deckName} (${isOnePieceDeck ? 'One Piece TCG' : 'Pokémon TCG'})\n`;
    if (leaderCard) text += `LEADER: 1x ${leaderCard.name} (${leaderCard.code})\n`;
    text += `\n// MAIN DECK (${totalMainCount} carte):\n`;
    mainDeckCards.forEach(c => {
      text += `${c.quantity || 1}x ${c.name} (${c.code}) - ${c.set}\n`;
    });
    if (donCards.length > 0) {
      text += `\n// DON!! DECK (${totalDonCount} carte):\n`;
      donCards.forEach(c => text += `${c.quantity || 1}x ${c.name}\n`);
    }

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Deck Title & Actions */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            className="text-2xl font-black bg-transparent text-white border-b border-dashed border-slate-700 focus:border-amber-500 focus:outline-none font-heading"
          />
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 font-mono">
            <span>Formato: <strong className="text-amber-400">{isOnePieceDeck ? 'One Piece TCG' : 'Pokémon TCG'}</strong></span>
            <span>Carte Totali: <strong className="text-slate-200">{totalCardCount}</strong></span>
            <span>Valore Stimato: <strong className="text-emerald-400">€{totalPrice.toFixed(2)}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportDeckText}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-all shadow"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedText ? 'Copiato in Appunti!' : 'Esporta Mazzo'}</span>
          </button>

          <button
            onClick={clearDeck}
            className="px-4 py-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-950/80 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Svuota</span>
          </button>
        </div>
      </div>

      {/* Deck Rule Validation Status Banner */}
      <div className={`glass-panel p-4 rounded-2xl border flex items-start gap-3 ${
        isValidDeck 
          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
          : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
      }`}>
        {isValidDeck ? (
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        )}
        <div>
          <h4 className="font-extrabold text-sm font-heading">
            {isValidDeck ? 'Mazzo Valido per Tornei Ufficiali!' : 'Stato Validazione Regole Mazzo:'}
          </h4>
          {!isValidDeck && (
            <ul className="text-xs space-y-1 mt-1 font-mono list-disc list-inside text-amber-200/90">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Cards List */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* One Piece Leader Section */}
          {isOnePieceDeck && (
            <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 bg-rose-950/10">
              <span className="text-xs uppercase font-extrabold tracking-wider text-rose-400 block mb-2">Carta Leader (1x)</span>
              {leaderCard ? (
                <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectCard(leaderCard)}>
                    <img src={leaderCard.image} alt={leaderCard.name} className="w-10 h-14 object-contain rounded" />
                    <div>
                      <div className="font-bold text-sm text-slate-100">{leaderCard.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{leaderCard.code} | {leaderCard.color?.join(', ')} | PWR {leaderCard.power}</div>
                    </div>
                  </div>
                  <button onClick={() => removeCard(leaderCard.id)} className="p-2 text-slate-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic p-3 text-center border border-dashed border-slate-800 rounded-xl">
                  Nessun Leader selezionato. Aggiungi un Leader di One Piece dall'Explorer.
                </div>
              )}
            </div>
          )}

          {/* Cards Table List */}
          <div className="glass-panel rounded-2xl border border-slate-800 p-4">
            <h3 className="text-sm font-extrabold text-slate-200 mb-3 font-heading">
              Carte Mazzo Principale ({mainDeckCards.reduce((acc, c) => acc + (c.quantity || 1), 0)})
            </h3>

            {mainDeckCards.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Il tuo mazzo è vuoto. Clicca su "+ Aggiungi al Mazzo" sulle carte dall'Explorer per iniziare!
              </div>
            ) : (
              <div className="space-y-2">
                {mainDeckCards.map((c) => (
                  <div key={c.id} className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectCard(c)}>
                      <img src={c.image} alt={c.name} className="w-8 h-11 object-contain rounded" />
                      <div>
                        <div className="font-bold text-xs text-slate-100">{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.code} • {c.rarity}</div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-amber-400 font-mono">€{(c.marketPrice * (c.quantity || 1)).toFixed(2)}</span>
                      <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 p-1">
                        <button onClick={() => updateQuantity(c.id, -1)} className="px-2 py-0.5 text-slate-400 hover:text-white text-xs font-bold">-</button>
                        <span className="px-2 text-xs font-black text-amber-400 font-mono">{c.quantity || 1}</span>
                        <button onClick={() => updateQuantity(c.id, 1)} className="px-2 py-0.5 text-slate-400 hover:text-white text-xs font-bold">+</button>
                      </div>
                      <button onClick={() => removeCard(c.id)} className="p-1 text-slate-400 hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Deck Analytics & Curve Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-100 font-heading">Statistiche Curva Costo</h3>
            
            {/* Cost Curve Histogram */}
            <div className="space-y-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((cost) => {
                const count = mainDeckCards.filter(c => (c.cost ?? c.hp ?? 0) === cost).reduce((a, b) => a + (b.quantity || 1), 0);
                const maxCount = Math.max(1, ...mainDeckCards.map(c => c.quantity || 1));
                const widthPercent = (count / (maxCount || 1)) * 100;
                
                if (count === 0 && cost > 7) return null;

                return (
                  <div key={cost} className="flex items-center text-xs gap-2">
                    <span className="w-12 text-slate-400 font-mono text-[11px]">Costo {cost}</span>
                    <div className="flex-1 bg-slate-900 rounded-full h-3 overflow-hidden">
                      <div 
                        style={{ width: `${Math.min(100, widthPercent * 2)}%` }} 
                        className="bg-amber-500 h-full rounded-full transition-all"
                      />
                    </div>
                    <span className="w-6 text-right font-mono font-bold text-amber-400">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
