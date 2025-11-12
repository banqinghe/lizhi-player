/**
 * @file 当前播放的歌曲和歌单
 */

import { atom, useAtomValue, useSetAtom } from 'jotai';
import type { Album, Song } from '@/types';
import { getAlbumById } from '@/utils';

interface CurPlay {
    song: Song;
    list: Song[];
    isPlaying: boolean;
    curSeconds: number;
    album: Album;
}

// const curPlayAtom = atom<CurPlay | null>(null);

// debug
const curPlayAtom = atom<CurPlay | null>({
    curSeconds: 0,
    album: getAlbumById(0),
    song: {
        albumId: 0,
        songId: 0,
        name: '你离开了南京，从此没有人和我说话',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/梵高先生/你离开了南京，从此没有人和我说话.mp3',
    },
    list: [
        {
            albumId: 0,
            songId: 0,
            name: '梵高先生',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/梵高先生/你离开了南京，从此没有人和我说话.mp3',
        },
    ],
    isPlaying: false,
});

export function useCurPlay() {
    return useAtomValue(curPlayAtom);
}

export function useSetCurPlay() {
    return useSetAtom(curPlayAtom);
}
