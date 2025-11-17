/**
 * @file 我的喜欢列表
 */

import { create } from 'zustand';
import type { Song } from '@/types';
import { getSongById } from '@/utils';

// const likeListAtom = atom<Song[]>([]);

// mock
const mockData: Song[] = [
    {
        albumId: 16,
        songId: 207,
        name: '黑色信封',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/北京不插电/黑色信封.mp3',
    },
    {
        albumId: 12,
        songId: 72,
        name: '意味',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/二零零九年十月十六日事件/意味.mp3',
    },
    {
        albumId: 3,
        songId: 33,
        name: '意味',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/我爱南京/意味.mp3',
    },
    {
        albumId: 3,
        songId: 39,
        name: '爱',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/我爱南京/爱.mp3',
    },
    {
        albumId: 3,
        songId: 46,
        name: '思念观世音',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/我爱南京/思念观世音.mp3',
    },
    {
        albumId: 0,
        songId: 5,
        name: '暧昧',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/梵高先生/暧昧.mp3',
    },
    {
        albumId: 3,
        songId: 34,
        name: '苍井空',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/我爱南京/苍井空.mp3',
    },
    {
        albumId: 12,
        songId: 62,
        name: '狐狸',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/二零零九年十月十六日事件/狐狸.mp3',
    },
    {
        albumId: 2,
        songId: 19,
        name: '来了',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/工体东路没有人/来了.mp3',
    },
    {
        albumId: 5,
        songId: 93,
        name: '她',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/Imagine-2011/她.mp3',
    },
    {
        albumId: 1,
        songId: 15,
        name: '罗庄的冬天',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/被禁忌的游戏/罗庄的冬天.mp3',
    },
    {
        albumId: 0,
        songId: 4,
        name: '广场',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/梵高先生/广场.mp3',
    },
    {
        albumId: 11,
        songId: 167,
        name: '妈妈',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/io/妈妈.mp3',
    },
    {
        albumId: 11,
        songId: 162,
        name: '杭州',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/io/杭州.mp3',
    },
    {
        albumId: 12,
        songId: 68,
        name: '倒影',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/二零零九年十月十六日事件/倒影.mp3',
    },
    {
        albumId: 10,
        songId: 158,
        name: '妈妈',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/勾三搭四/妈妈.mp3',
    },
    {
        albumId: 10,
        songId: 157,
        name: '来了',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/勾三搭四/来了.mp3',
    },
    {
        albumId: 1,
        songId: 12,
        name: '欢愉',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/被禁忌的游戏/欢愉.mp3',
    },
    {
        albumId: 5,
        songId: 94,
        name: '家乡',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/Imagine-2011/家乡.mp3',
    },
    {
        albumId: 10,
        name: '铅笔',
        songId: 145,
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/勾三搭四/铅笔.mp3',
    },
    {
        albumId: 5,
        songId: 92,
        name: '海的女儿',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/Imagine-2011/海的女儿.mp3',
    },
    {
        albumId: 2,
        songId: 17,
        name: '被禁忌的游戏',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/工体东路没有人/被禁忌的游戏.mp3',
    },
    {
        albumId: 9,
        name: '你的早晨',
        songId: 140,
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/F/你的早晨.mp3',
    },
    {
        albumId: 2,
        songId: 28,
        name: '红色气球',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/工体东路没有人/红色气球.mp3',
    },
    {
        albumId: 12,
        songId: 175,
        name: '你离开了南京，从此没有人和我说话',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/看见/你离开了南京，从此没有人和我说话.mp3',
    },
    {
        albumId: 17,
        songId: 227,
        name: '墙上的向日葵',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/电声与管弦乐/墙上的向日葵.mp3',
    },
    {
        albumId: 16,
        songId: 211,
        name: '这个世界会好吗',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/北京不插电/这个世界会好吗.mp3',
    },
    {
        albumId: 12,
        songId: 172,
        name: '黑色信封',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/看见/黑色信封.mp3',
    },
    {
        albumId: 2,
        songId: 32,
        name: '想起了他',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/工体东路没有人/想起了他.mp3',
    },
    {
        albumId: 15,
        songId: 198,
        name: '歌声与微笑',
        url: 'https://testingcf.jsdelivr.net/gh/nj-lizhi/song@main/audio/8/歌声与微笑.mp3',
    },
];

interface LikeListStore {
    likeList: Song[];
    likeSet: ReadonlySet<number>;
    setLikeList: (list: Song[]) => void;
    addToLikeList: (songId: number) => void;
    removeFromLikeList: (songId: number) => void;
    toggleLike: (songId: number) => void;
}

const useLikeListStore = create<LikeListStore>(set => ({
    likeList: mockData,
    likeSet: new Set(mockData.map(song => song.songId)),
    setLikeList: list => set({
        likeList: list,
        likeSet: new Set(list.map(song => song.songId)),
    }),
    addToLikeList: (songId) => {
        const song = getSongById(songId);
        if (!song) return;
        set((state) => {
            if (state.likeSet.has(songId)) return state;
            const newList = [song, ...state.likeList];
            return {
                likeList: newList,
                likeSet: new Set(newList.map(s => s.songId)),
            };
        });
    },
    removeFromLikeList: (songId) => {
        set((state) => {
            const newList = state.likeList.filter(s => s.songId !== songId);
            if (newList.length === state.likeList.length) return state;
            return {
                likeList: newList,
                likeSet: new Set(newList.map(s => s.songId)),
            };
        });
    },
    toggleLike: (songId) => {
        set((state) => {
            const exists = state.likeSet.has(songId);
            if (exists) {
                const newList = state.likeList.filter(s => s.songId !== songId);
                return {
                    likeList: newList,
                    likeSet: new Set(newList.map(s => s.songId)),
                };
            } else {
                const song = getSongById(songId);
                if (!song) return state;
                const newList = [song, ...state.likeList];
                return {
                    likeList: newList,
                    likeSet: new Set(newList.map(s => s.songId)),
                };
            }
        });
    },
}));

export function useLikeList() {
    return useLikeListStore(state => state.likeList);
}

export function useSetLikeList() {
    return useLikeListStore(state => state.setLikeList);
}

export function useLikeSet() {
    return useLikeListStore(state => state.likeSet);
}

export function useAddToLikeList() {
    return useLikeListStore(state => state.addToLikeList);
}

export function useRemoveFromLikeList() {
    return useLikeListStore(state => state.removeFromLikeList);
}

export function useToggleLike() {
    return useLikeListStore(state => state.toggleLike);
}
