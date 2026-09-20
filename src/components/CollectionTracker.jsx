import React, { useState } from 'react';
import { BookmarkCheck, Heart, TrendingUp, DollarSign, Trash2, Download, Plus } from 'lucide-react';

export default function CollectionTracker({ collectionCards, setCollectionCards, onSelectCard }) {
  const [activeSubTab, setActiveSubTab] = useState('owned'); // 'owned' or 'wishlist'

  const totalValue = collectionCards.reduce((acc, item) => acc + (item.card.marketPrice * (item.quantity || 1)), 0);
  const totalCount = collectionCards.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const updateQuantity = (cardId, delta) => {
    setCollectionCards(prev => prev.map(item => {
      if (item.card.id === cardId) {
        const newQ = (item.quantity || 1) + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeCard = (cardId) => {
    setCollectionCards(prev => prev.filter(item => item.card.id !== cardId));
  };

  const exportCSV = () => {
    let csv = 'Nome,Gioco,Codice,Rarità,Quantità,Prezzo Mercato (€),Valore Totale (€)\n';
    collectionCards.forEach(item => {
      const c = item.card;
      const val = (c.marketPrice * (item.quantity || 1)).toFixed(2);
      csv += `"${c.name}","${c.game}","${c.code}","${c.rarity}",${item.quantity || 1},${c.marketPrice},${val}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tcg-vault-collection-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-amber-500/10 to-transparent">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-bold mb-1">
            <span>Valore Totale Collezione</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">
            €{totalValue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Valore stimato di mercato live</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-emerald-500/10 to-transparent">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-bold mb-1">
            <span>Carte Possedute</span>
            <BookmarkCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">{collectionCards.length} carte uniche nel tuo binder</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-indigo-500/10 to-transparent flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-bold mb-1">
            <span>Esporta Dati</span>
            <Download className="w-4 h-4 text-indigo-400" />
          </div>
          <button
            onClick={exportCSV}
            disabled={collectionCards.length === 0}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md disabled:opacity-50"
          >
            Esporta in CSV / Excel
          </button>
        </div>
      </div>

      {/* Collection List Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-extrabold text-white font-heading">
            Il Mio Binder Virtuale ({collectionCards.length})
          </h2>
        </div>

        {collectionCards.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-3">
            <Heart className="w-12 h-12 text-slate-600 mx-auto" />
            <div className="text-sm font-bold text-slate-300">La tua collezione è vuota</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Aggiungi carte alla tua collezione cliccando sull'icona a cuore nelle schede delle carte.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {collectionCards.map((item) => {
              const c = item.card;
              return (
                <div key={c.id} className="flex items-center justify-between bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => onSelectCard(c)}>
                    <img src={c.image} alt={c.name} className="w-10 h-14 object-contain rounded" />
                    <div>
                      <div className="font-bold text-sm text-slate-100">{c.name}</div>
                      <div className="text-xs text-slate-400 font-mono">
                        {c.code} • {c.set} • <strong className="text-amber-400">{c.rarity}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Valore Totale</div>
                      <div className="text-sm font-black text-amber-400 font-mono">
                        €{(c.marketPrice * (item.quantity || 1)).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 p-1">
                      <button onClick={() => updateQuantity(c.id, -1)} className="px-2 py-0.5 text-slate-400 hover:text-white text-xs font-bold">-</button>
                      <span className="px-2.5 text-xs font-black text-amber-400 font-mono">{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(c.id, 1)} className="px-2 py-0.5 text-slate-400 hover:text-white text-xs font-bold">+</button>
                    </div>

                    <button onClick={() => removeCard(c.id)} className="p-2 text-slate-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
