import { LibraryTab } from '../types/ui';

export const RECENT_TRACKS = [
  'Midnight Paws - Neko Waves',
  'Whisker Drive - City Loops',
  'Sleepy Tail - Lo-Fi Garden',
];

export const RECOMMENDED_PLAYLISTS = [
  'Noite Neon Felina',
  'Indie para Alongar Bigodes',
  'Foco com Ronronar',
];

export const LIBRARY_DATA: Record<LibraryTab, string[]> = {
  Musicas: ['Signals', 'Breathe', 'Neon Steps', 'Rain in Binary', 'Warm Circuits'],
  Artistas: ['Neko Waves', 'Mina Flux', 'Purrsona 84', 'Cloud Kitten'],
  Albuns: ['Night Shift', 'Soft Static', 'Horizon Paws'],
  Playlists: ['Coding Cat', 'Road to Downtown', 'Late Night Beats'],
};
