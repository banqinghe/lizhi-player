import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';
import source from '@/source';
import type { Album, Song } from './types';

const allSongs = source.albums.flatMap(album => album.songs);

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const albumIdCache = new Map<number, Album>();
export function getAlbumById(albumId: number): Album {
    if (albumIdCache.has(albumId)) {
        return albumIdCache.get(albumId)!;
    }

    const album = source.albums.find(album => album.albumId === albumId);
    if (!album) {
        throw new Error(`Album with ID ${albumId} not found`);
    }
    albumIdCache.set(albumId, album);
    return album;
}

const songIdCache = new Map<number, Song>();
export function getSongById(songId: number): Song {
    if (songIdCache.has(songId)) {
        return songIdCache.get(songId)!;
    }

    for (const album of source.albums) {
        const song = album.songs.find(song => song.songId === songId);
        if (song) {
            songIdCache.set(songId, song);
            return song;
        }
    }

    throw new Error(`Song with ID ${songId} not found`);
}

/** Fisher-Yates shuffle */
function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const dailyKey = 'dailyRandomSongs';

/** 每日随机 50 首 */
export function getRandomSong(): Song[] {
    const dailyStorage = localStorage.getItem(dailyKey);
    if (dailyStorage) {
        const { date, songs } = JSON.parse(dailyStorage) as {
            date: string;
            songs: Song[];
        };
        if (date === new Date().toDateString()) {
            return songs;
        }
    }
    const shuffled = shuffleArray([...allSongs]);
    shuffled.slice(0, 50);
    const dailyData = {
        date: new Date().toDateString(),
        songs: shuffled.slice(0, 50),
    };
    localStorage.setItem(dailyKey, JSON.stringify(dailyData));
    return dailyData.songs;
}
