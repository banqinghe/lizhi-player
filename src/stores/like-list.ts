/**
 * @file 我的喜欢列表
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Song } from '@/types';
import { getSongById } from '@/utils';

interface LikeListStore {
    likeList: Song[];
    likeSet: ReadonlySet<number>;
    setLikeList: (list: Song[]) => void;
    addToLikeList: (songId: number) => void;
    removeFromLikeList: (songId: number) => void;
    toggleLike: (songId: number) => void;
}

const useLikeListStore = create<LikeListStore>()(persist(set => ({
    likeList: [],
    likeSet: new Set(),
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
}), {
    name: 'like-list-storage',
    partialize: state => ({ likeList: state.likeList }),
    onRehydrateStorage: () => (state) => {
        if (state) {
            state.likeSet = new Set(state.likeList.map(song => song.songId));
        }
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
