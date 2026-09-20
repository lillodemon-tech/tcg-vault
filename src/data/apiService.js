// API Service for fetching TCG cards dynamically from public APIs with local cache fallback

import { INITIAL_CARDS } from './cardsData';

const POKEMON_API_URL = 'https://api.pokemontcg.io/v2/cards';

export async function fetchPokemonCards(query = '', page = 1, pageSize = 20) {
  try {
    let url = `${POKEMON_API_URL}?page=${page}&pageSize=${pageSize}`;
    if (query) {
      url += `&q=name:${encodeURIComponent(query)}*`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API response status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data && data.data) {
      return data.data.map(transformPokemonCard);
    }
    return getLocalPokemonFallback(query);
  } catch (error) {
    console.warn('Live API fetch failed, falling back to local dataset:', error.message);
    return getLocalPokemonFallback(query);
  }
}

function transformPokemonCard(card) {
  return {
    id: `pok-api-${card.id}`,
    game: 'pokemon',
    name: card.name,
    code: `${card.number}/${card.set?.total || '???'}`,
    set: card.set?.name || 'Unknown Set',
    setCode: card.set?.id || 'SET',
    rarity: card.rarity || 'Common',
    category: card.supertype === 'Energy' ? 'Energy' : card.supertype === 'Trainer' ? 'Trainer' : 'Pokémon',
    pokemonType: card.types?.[0] || 'Colorless',
    stage: card.subtypes?.[0] || 'Basic',
    hp: card.hp ? parseInt(card.hp, 10) : null,
    attacks: card.attacks ? card.attacks.map(a => ({
      name: a.name,
      cost: a.cost || [],
      damage: a.damage || '-',
      description: a.text || ''
    })) : [],
    weakness: card.weaknesses ? `${card.weaknesses[0].type} ${card.weaknesses[0].value}` : 'None',
    retreat: card.retreatCost?.length || 0,
    effect: card.rules?.[0] || '',
    image: card.images?.large || card.images?.small,
    artType: card.rarity?.includes('Rare') ? 'Holo / Rare' : 'Standard',
    illustrator: card.artist || 'Unknown',
    marketPrice: card.cardmarket?.prices?.averageSellPrice || card.tcgplayer?.prices?.holofoil?.market || 5.00,
    priceHistory: [
      { date: '2024-05', price: (card.cardmarket?.prices?.averageSellPrice || 5.00) * 0.9 },
      { date: '2024-09', price: card.cardmarket?.prices?.averageSellPrice || 5.00 }
    ],
    legalities: {
      standard: card.legalities?.standard || 'Legal',
      expanded: card.legalities?.expanded || 'Legal'
    }
  };
}

function getLocalPokemonFallback(query) {
  const localPokemons = INITIAL_CARDS.filter(c => c.game === 'pokemon');
  if (!query) return localPokemons;
  return localPokemons.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
}
