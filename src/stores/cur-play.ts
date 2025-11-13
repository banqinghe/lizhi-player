/**
 * @file 当前播放的歌曲和歌单
 */

import { atom, useAtomValue, useSetAtom } from 'jotai';
import type { Album, PlayMode, Song } from '@/types';
import { getAlbumById } from '@/utils';

interface CurPlay {
    song: Song;
    list: Song[];
    isPlaying: boolean;
    currentTime: number;
    album: Album;
    playMode: PlayMode;
}

// const curPlayAtom = atom<CurPlay | null>(null);

// debug
const curPlayAtom = atom<CurPlay | null>({
    currentTime: 0,
    playMode: 'repeat',
    isPlaying: false,
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
        {
            albumId: 18,
            songId: 231,
            name: '相信未来序曲',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/电声与管弦乐II/相信未来序曲 (乐曲).mp3',
        },
        {
            albumId: 18,
            songId: 232,
            name: '一头偶像',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/电声与管弦乐II/一头偶像 (相信未来版).mp3',
        },
        {
            albumId: 18,
            songId: 233,
            name: '你好明天',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/电声与管弦乐II/你好明天 (相信未来版).mp3',
        },
        {
            albumId: 18,
            songId: 234,
            name: '寻找',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/电声与管弦乐II/寻找 (相信未来版).mp3',
        },
        {
            albumId: 18,
            songId: 235,
            name: '山阴路的夏天',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/电声与管弦乐II/山阴路的夏天 (相信未来版).mp3',
        },
        {
            albumId: 18,
            songId: 236,
            name: '哦吼',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/电声与管弦乐II/哦吼 (相信未来版).mp3',
        },
        {
            albumId: 18,
            songId: 237,
            name: '天空之城',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/电声与管弦乐II/天空之城 (相信未来版).mp3',
        },
        {
            albumId: 18,
            songId: 238,
            name: '家乡',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/电声与管弦乐II/家乡 (相信未来版).mp3',
        },
        {
            albumId: 18,
            songId: 239,
            name: '这个世界会好吗',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/电声与管弦乐II/这个世界会好吗 (相信未来版).mp3',
        },
        {
            albumId: 15,
            songId: 198,
            name: '歌声与微笑',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/8/歌声与微笑.mp3',
        },
        {
            albumId: 15,
            songId: 199,
            name: '蜗牛与黄鹂鸟',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/8/蜗牛与黄鹂鸟.mp3',
        },
        {
            albumId: 15,
            songId: 200,
            name: '兰花草',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/8/兰花草.mp3',
        },
        {
            albumId: 15,
            songId: 201,
            name: '数鸭子',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/8/数鸭子.mp3',
        },
        {
            albumId: 15,
            songId: 202,
            name: '朋友越多越快乐',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/8/朋友越多越快乐.mp3',
        },
        {
            albumId: 15,
            songId: 203,
            name: 'Hey Jude',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/8/Hey Jude.mp3',
        },
        {
            albumId: 15,
            songId: 204,
            name: '采蘑菇的小姑娘',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/8/采蘑菇的小姑娘.mp3',
        },
        {
            albumId: 15,
            songId: 205,
            name: '小螺号',
            url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/8/小螺号.mp3',
        },
    ],
});

export function useCurPlay() {
    return useAtomValue(curPlayAtom);
}

export function useSetCurPlay() {
    return useSetAtom(curPlayAtom);
}
