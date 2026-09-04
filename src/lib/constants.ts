export const PLAYER_1 = {
  name: 'Leok07',
  searchNames: ['Leok07', 'leok07'],
  platform: 'epic' as const,
  platformId: 'epic:cc38f648e9ab4ac5bdd44b273febe7c4',
  platformLabel: 'Epic Games (PC)',
  teamColor: 'blue',
};

export const PLAYER_2 = {
  name: 'Theuszrib',
  searchNames: ['Theuszrib', 'theusrib', 'theuszrib'],
  platform: 'ps4' as const,
  platformId: 'ps4:theusrib',
  platformLabel: 'PlayStation 5',
  teamColor: 'orange',
};

export const PLAYLISTS_2V2 = [
  { id: 'all', label: 'Todas as Partidas' },
  { id: 'ranked-doubles', label: '2v2 Competitivo' },
  { id: 'unranked-doubles', label: '2v2 Casual' },
] as const;

export const DEFAULT_PLAYLIST = 'all';
export const DEFAULT_REPLAY_COUNT = 50;

export const RADAR_AXES = [
  { key: 'aggressiveness', label: 'Agressividade' },
  { key: 'defense', label: 'Contencao Defensiva' },
  { key: 'mechanics', label: 'Eficiencia Mecanica' },
  { key: 'support', label: 'Suporte e Posicionamento' },
  { key: 'boostControl', label: 'Controle de Boost' },
] as const;
