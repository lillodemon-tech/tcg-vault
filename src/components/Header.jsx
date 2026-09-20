import React from 'react';
import { 
  Sparkles, 
  Search, 
  Layers, 
  Package, 
  BookmarkCheck, 
  Flame, 
  ArrowLeftRight,
  ShieldAlert,
  FolderOpen
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  activeGame, 
  setActiveGame, 
  searchQuery, 
  setSearchQuery,
  collectionTotalValue,
  collectionCount,
  deckCardsCount,
  compareListCount,
  onOpenCompare
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('explorer')}>
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-lg shadow-rose-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white font-heading">TCG<span className="text-amber-400">VAULT</span></span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Live Hub
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">One Piece & Pokémon Trading Card Hub</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca carte, personaggi, set (es. Luffy, Charizard, OP05)..."
                className="w-full bg-slate-900/90 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded"
                >
                  ESC
                </button>
              )}
            </div>
          </div>

          {/* TCG Game Selector Switcher */}
          <div className="hidden lg:flex items-center bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveGame('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeGame === 'all'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tutti i TCG
            </button>
            <button
              onClick={() => setActiveGame('onepiece')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeGame === 'onepiece'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-900/40'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              One Piece TCG
            </button>
            <button
              onClick={() => setActiveGame('pokemon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeGame === 'pokemon'
                  ? 'bg-gradient-to-r from-amber-500 to-blue-600 text-white shadow-lg shadow-amber-900/40'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Pokémon TCG
            </button>
          </div>

          {/* User Quick Collection Stats */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Valore Collezione</div>
              <div className="text-sm font-extrabold text-amber-400 font-mono">
                €{collectionTotalValue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {compareListCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="relative p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-all flex items-center gap-1.5 text-xs font-semibold"
                title="Confronta Carte"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Confronta ({compareListCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Navigation Bar */}
        <div className="flex items-center justify-between border-t border-slate-800/60 py-2.5 overflow-x-auto scrollbar-none">
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('explorer')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'explorer'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Esplora Carte</span>
            </button>

            <button
              onClick={() => setActiveTab('sets')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'sets'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Espansioni & Set</span>
            </button>

            <button
              onClick={() => setActiveTab('deck')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'deck'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Deck Builder</span>
              {deckCardsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-extrabold">
                  {deckCardsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('collection')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'collection'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>La Mia Collezione</span>
              {collectionCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500 text-slate-950 font-extrabold">
                  {collectionCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('pack')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'pack'
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Pack Simulator</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider bg-purple-500/20 text-purple-300 font-extrabold">
                NEW
              </span>
            </button>
          </nav>

          {/* Mobile Game Switcher */}
          <div className="flex lg:hidden items-center gap-1 ml-2">
            <button
              onClick={() => setActiveGame(activeGame === 'onepiece' ? 'pokemon' : activeGame === 'pokemon' ? 'all' : 'onepiece')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 border border-slate-800 text-amber-400 flex items-center gap-1"
            >
              <span>{activeGame === 'all' ? 'Tutti' : activeGame === 'onepiece' ? 'One Piece' : 'Pokémon'}</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
