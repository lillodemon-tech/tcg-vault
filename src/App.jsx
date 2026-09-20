import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import FiltersSidebar from './components/FiltersSidebar';
import CardGrid from './components/CardGrid';
import CardModal from './components/CardModal';
import DeckBuilder from './components/DeckBuilder';
import CollectionTracker from './components/CollectionTracker';
import PackSimulator from './components/PackSimulator';
import CompareModal from './components/CompareModal';
import SetsExplorer from './components/SetsExplorer';
import { INITIAL_CARDS } from './data/cardsData';
import { fetchPokemonCards } from './data/apiService';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  // Navigation & Game State
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer', 'sets', 'deck', 'collection', 'pack'
  const [activeGame, setActiveGame] = useState('all'); // 'all', 'onepiece', 'pokemon'
  
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRarities, setSelectedRarities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [sortBy, setSortBy] = useState('price-desc');
  const [selectedSetFilter, setSelectedSetFilter] = useState('');

  // Modals & User Data persistent state
  const [selectedCardModal, setSelectedCardModal] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Cards dataset (Local + live API results)
  const [allCards, setAllCards] = useState(INITIAL_CARDS);
  const [isSearchingLive, setIsSearchingLive] = useState(false);

  // Persisted Deck State
  const [deckCards, setDeckCards] = useState(() => {
    try {
      const saved = localStorage.getItem('tcg_vault_deck');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persisted Collection State
  const [collectionCards, setCollectionCards] = useState(() => {
    try {
      const saved = localStorage.getItem('tcg_vault_collection');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tcg_vault_deck', JSON.stringify(deckCards));
    } catch (e) {}
  }, [deckCards]);

  useEffect(() => {
    try {
      localStorage.setItem('tcg_vault_collection', JSON.stringify(collectionCards));
    } catch (e) {}
  }, [collectionCards]);

  // Live Pokémon API Fetching when query changes
  useEffect(() => {
    if (searchQuery.trim().length > 2 && (activeGame === 'pokemon' || activeGame === 'all')) {
      setIsSearchingLive(true);
      const timer = setTimeout(async () => {
        const livePokemons = await fetchPokemonCards(searchQuery);
        setAllCards((prev) => {
          const nonApiLocal = prev.filter((c) => !c.id.startsWith('pok-api-'));
          return [...nonApiLocal, ...livePokemons];
        });
        setIsSearchingLive(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, activeGame]);

  // Handle adding card to deck
  const handleAddToDeck = (card) => {
    setDeckCards((prev) => {
      const existing = prev.find((c) => c.id === card.id);
      if (existing) {
        return prev.map((c) => (c.id === card.id ? { ...c, quantity: (c.quantity || 1) + 1 } : c));
      }
      return [...prev, { ...card, quantity: 1 }];
    });
  };

  // Handle collection toggle
  const handleToggleCollection = (card) => {
    setCollectionCards((prev) => {
      const existing = prev.find((item) => item.card.id === card.id);
      if (existing) {
        return prev.filter((item) => item.card.id !== card.id);
      }
      return [...prev, { card, quantity: 1 }];
    });
  };

  // Handle compare list toggle
  const handleToggleCompare = (card) => {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.id === card.id);
      if (exists) {
        return prev.filter((c) => c.id !== card.id);
      }
      if (prev.length >= 4) {
        alert('Puoi confrontare al massimo 4 carte contemporaneamente.');
        return prev;
      }
      return [...prev, card];
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedColors([]);
    setSelectedRarities([]);
    setSelectedCategory('');
    setMaxPrice(5000000);
    setSortBy('price-desc');
    setSelectedSetFilter('');
  };

  const handleSelectSetFromExplorer = (setName, game) => {
    setSelectedSetFilter(setName);
    setActiveGame(game);
    setActiveTab('explorer');
  };

  // Calculate Collection Total Value
  const collectionTotalValue = useMemo(() => {
    return collectionCards.reduce((acc, item) => acc + item.card.marketPrice * (item.quantity || 1), 0);
  }, [collectionCards]);

  // Filtered & Sorted Cards Computation
  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      // Filter by Game
      if (activeGame !== 'all' && card.game !== activeGame) return false;

      // Filter by Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesCode = card.code.toLowerCase().includes(q);
        const matchesSet = card.set.toLowerCase().includes(q);
        const matchesType = card.type ? card.type.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesCode && !matchesSet && !matchesType) return false;
      }

      // Filter by Set
      if (selectedSetFilter && !card.set.toLowerCase().includes(selectedSetFilter.toLowerCase())) {
        return false;
      }

      // Filter by Category
      if (selectedCategory) {
        if (card.category !== selectedCategory) return false;
      }

      // Filter by Rarity
      if (selectedRarities.length > 0) {
        if (!selectedRarities.some((r) => card.rarity.toLowerCase().includes(r.toLowerCase()))) {
          return false;
        }
      }

      // Filter by Color / Element
      if (selectedColors.length > 0) {
        const cardColors = card.color || [card.pokemonType];
        if (!cardColors.some((c) => selectedColors.includes(c))) return false;
      }

      // Filter by Max Price
      if (card.marketPrice > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-desc') return b.marketPrice - a.marketPrice;
      if (sortBy === 'price-asc') return a.marketPrice - b.marketPrice;
      if (sortBy === 'power-desc') return (b.power || b.hp || 0) - (a.power || a.hp || 0);
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'code-asc') return a.code.localeCompare(b.code);
      return 0;
    });
  }, [allCards, activeGame, searchQuery, selectedSetFilter, selectedCategory, selectedRarities, selectedColors, maxPrice, sortBy]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeGame={activeGame}
        setActiveGame={setActiveGame}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        collectionTotalValue={collectionTotalValue}
        collectionCount={collectionCards.length}
        deckCardsCount={deckCards.reduce((a, b) => a + (b.quantity || 1), 0)}
        compareListCount={compareList.length}
        onOpenCompare={() => setIsCompareOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Active Set Filter Indicator Banner */}
        {selectedSetFilter && activeTab === 'explorer' && (
          <div className="mb-6 p-4 rounded-2xl glass-panel border border-amber-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <span>Stai filtrando per il Set:</span>
              <strong className="text-amber-400 font-extrabold">{selectedSetFilter}</strong>
            </div>
            <button
              onClick={() => setSelectedSetFilter('')}
              className="px-3 py-1 bg-slate-800 text-xs font-bold text-slate-300 rounded-lg hover:text-white hover:bg-slate-700"
            >
              Rimuovi Filtro Set
            </button>
          </div>
        )}

        {/* Tab 1: Card Explorer */}
        {activeTab === 'explorer' && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <FiltersSidebar
              activeGame={activeGame}
              setActiveGame={setActiveGame}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              selectedRarities={selectedRarities}
              setSelectedRarities={setSelectedRarities}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onResetFilters={handleResetFilters}
            />

            <CardGrid
              cards={filteredCards}
              onSelectCard={(card) => setSelectedCardModal(card)}
              onAddToDeck={handleAddToDeck}
              deckCards={deckCards}
              onToggleCollection={handleToggleCollection}
              collectionCards={collectionCards.map(item => item.card)}
              onToggleCompare={handleToggleCompare}
              compareList={compareList}
            />
          </div>
        )}

        {/* Tab 2: Sets Explorer */}
        {activeTab === 'sets' && (
          <SetsExplorer
            activeGame={activeGame}
            onSelectSet={handleSelectSetFromExplorer}
          />
        )}

        {/* Tab 3: Deck Builder */}
        {activeTab === 'deck' && (
          <DeckBuilder
            deckCards={deckCards}
            setDeckCards={setDeckCards}
            activeGame={activeGame}
            onSelectCard={(card) => setSelectedCardModal(card)}
          />
        )}

        {/* Tab 4: Collection Tracker */}
        {activeTab === 'collection' && (
          <CollectionTracker
            collectionCards={collectionCards}
            setCollectionCards={setCollectionCards}
            onSelectCard={(card) => setSelectedCardModal(card)}
          />
        )}

        {/* Tab 5: Pack Simulator */}
        {activeTab === 'pack' && (
          <PackSimulator
            onAddToCollection={handleToggleCollection}
            onAddToDeck={handleAddToDeck}
            onSelectCard={(card) => setSelectedCardModal(card)}
          />
        )}

      </main>

      {/* Card Detail High-Res Modal */}
      {selectedCardModal && (
        <CardModal
          card={selectedCardModal}
          onClose={() => setSelectedCardModal(null)}
          onAddToDeck={handleAddToDeck}
          isInDeck={deckCards.some((c) => c.id === selectedCardModal.id)}
          onToggleCollection={handleToggleCollection}
          isInCollection={collectionCards.some((item) => item.card.id === selectedCardModal.id)}
          onToggleCompare={handleToggleCompare}
          isInCompare={compareList.some((c) => c.id === selectedCardModal.id)}
        />
      )}

      {/* Side-by-Side Compare Modal */}
      {isCompareOpen && (
        <CompareModal
          compareList={compareList}
          onRemoveFromCompare={(id) => setCompareList((prev) => prev.filter((c) => c.id !== id))}
          onClose={() => setIsCompareOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            TCG VAULT © 2026 • Real-time One Piece & Pokémon Trading Card Game Database
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>One Piece TCG © Eiichiro Oda / Bandai</span>
            <span>Pokémon TCG © Nintendo / Creatures / GAME FREAK</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
