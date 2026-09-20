import React from 'react';
import { Filter, RotateCcw, Flame, Shield, Award, DollarSign } from 'lucide-react';

export default function FiltersSidebar({
  activeGame,
  setActiveGame,
  selectedColors,
  setSelectedColors,
  selectedRarities,
  setSelectedRarities,
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  onResetFilters
}) {
  const opColors = [
    { name: 'Red', bg: 'bg-red-600', text: 'text-red-200' },
    { name: 'Green', bg: 'bg-emerald-600', text: 'text-emerald-200' },
    { name: 'Blue', bg: 'bg-blue-600', text: 'text-blue-200' },
    { name: 'Purple', bg: 'bg-purple-600', text: 'text-purple-200' },
    { name: 'Black', bg: 'bg-slate-800', text: 'text-slate-200' },
    { name: 'Yellow', bg: 'bg-amber-500', text: 'text-slate-950' }
  ];

  const pokTypes = [
    { name: 'Fire', color: 'bg-red-500' },
    { name: 'Water', color: 'bg-blue-500' },
    { name: 'Grass', color: 'bg-emerald-500' },
    { name: 'Lightning', color: 'bg-amber-400' },
    { name: 'Psychic', color: 'bg-purple-500' },
    { name: 'Fighting', color: 'bg-orange-600' },
    { name: 'Darkness', color: 'bg-slate-800' },
    { name: 'Dragon', color: 'bg-yellow-600' },
    { name: 'Colorless', color: 'bg-slate-400' }
  ];

  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const toggleRarity = (rarity) => {
    if (selectedRarities.includes(rarity)) {
      setSelectedRarities(selectedRarities.filter((r) => r !== rarity));
    } else {
      setSelectedRarities([...selectedRarities, rarity]);
    }
  };

  return (
    <aside className="w-full lg:w-72 glass-panel rounded-2xl p-5 border border-slate-800 space-y-6 shrink-0 h-fit">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-amber-400" />
          <h2 className="font-extrabold text-base text-slate-100 font-heading">Filtri Avanzati</h2>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
          title="Ripristina filtri"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By Selector */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Ordinamento Carte
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        >
          <option value="price-desc">Prezzo: Dal più alto</option>
          <option value="price-asc">Prezzo: Dal più basso</option>
          <option value="power-desc">Potenza / HP: Dal più alto</option>
          <option value="name-asc">Nome: A - Z</option>
          <option value="code-asc">Numero Carta</option>
        </select>
      </div>

      {/* Category / Supertype Filter */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Categoria Carta
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {['Tutti', 'Leader', 'Character', 'Event', 'Pokémon', 'Trainer', 'Energy'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'Tutti' ? '' : cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                (cat === 'Tutti' && !selectedCategory) || selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Game Specific Type / Color Filters */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          {activeGame === 'onepiece' ? 'Colore (One Piece)' : activeGame === 'pokemon' ? 'Tipo (Pokémon)' : 'Colore / Tipo Elementale'}
        </label>
        
        {activeGame === 'onepiece' || activeGame === 'all' ? (
          <div className="space-y-2 mb-3">
            <div className="text-[11px] font-semibold text-rose-400">One Piece TCG:</div>
            <div className="flex flex-wrap gap-1.5">
              {opColors.map((c) => {
                const isSelected = selectedColors.includes(c.name);
                return (
                  <button
                    key={c.name}
                    onClick={() => toggleColor(c.name)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all border ${
                      isSelected
                        ? `${c.bg} ${c.text} border-white/40 shadow-md`
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {activeGame === 'pokemon' || activeGame === 'all' ? (
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-amber-400">Pokémon TCG:</div>
            <div className="flex flex-wrap gap-1.5">
              {pokTypes.map((t) => {
                const isSelected = selectedColors.includes(t.name);
                return (
                  <button
                    key={t.name}
                    onClick={() => toggleColor(t.name)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-slate-100 text-slate-950 border-white shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {/* Rarity Checkboxes */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Rarità Carte
        </label>
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {[
            'Manga Alternate Art',
            'Special Illustration Rare',
            'Alternate Art',
            'SEC',
            'L',
            'SR',
            'R',
            'Ultra Rare',
            'Secret Secret Rare Alt Art',
            'UC',
            'C'
          ].map((r) => (
            <label
              key={r}
              className="flex items-center justify-between text-xs text-slate-300 hover:text-white cursor-pointer py-1 px-2 rounded hover:bg-slate-900/60"
            >
              <span>{r}</span>
              <input
                type="checkbox"
                checked={selectedRarities.includes(r)}
                onChange={() => toggleRarity(r)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500/50"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold uppercase text-slate-400">Prezzo Massimo</span>
          <span className="font-extrabold text-amber-400 font-mono">
            {maxPrice >= 5000000 ? 'Qualsiasi' : `€${maxPrice.toLocaleString()}`}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="5000000"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-amber-500 bg-slate-900 rounded-lg cursor-pointer"
        />
      </div>

    </aside>
  );
}
