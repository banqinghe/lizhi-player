import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';
import source from '@/source';
import type { Album } from './types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const albumIdCache = new Map<number, Album>();
export function getAlbumById(albumId: number): Album {
    if (albumIdCache.has(albumId)) {
        return albumIdCache.get(albumId)!;
    }

    albumIdCache.set(albumId, source.albums.find(album => album.albumId === albumId)!);
    return albumIdCache.get(albumId)!;
}
