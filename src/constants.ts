/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  color: string;
}

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'Gemini Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&h=300&auto=format&fit=crop',
    color: '#00f2ff',
  },
  {
    id: '2',
    title: 'Cyber Drift',
    artist: 'Electric Echo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&h=300&auto=format&fit=crop',
    color: '#ff00ff',
  },
  {
    id: '3',
    title: 'Void Runner',
    artist: 'Digital Shadow',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=300&h=300&auto=format&fit=crop',
    color: '#39ff14',
  },
];

export const GAME_CONFIG = {
  GRID_SIZE: 20,
  INITIAL_SPEED: 150,
  SPEED_INCREMENT: 2,
};
