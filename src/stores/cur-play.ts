/**
 * @file 当前播放的歌曲和歌单
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlayMode, Song } from '@/types';
import { getSongById, isSamePlayList } from '@/utils';
import { useToast } from '@/components/toast';

const playModeNext: Record<PlayMode, PlayMode> = {
    'repeat': 'repeat-one',
    'repeat-one': 'shuffle',
    'shuffle': 'repeat',
};

export interface CurPlay {
    song: Song;
    list: Song[];
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    playMode: PlayMode;
    buffered: number;
    isBuffering: boolean;
}

export interface CurPlayStore {
    curPlay: CurPlay | null;
    setCurPlay: (curPlay: CurPlay | null) => void;
    addToNextPlay: (songId: number) => void;
    play: (songId: number) => void;
    playList: (list: Song[]) => void;
    removeFromPlayList: (songId: number) => void;
    playPrev: () => void;
    playNext: (auto?: boolean) => void;
    stopPlay: () => void;
    nextPlayMode: () => void;
    seekTo: (time: number) => void;
}

export const useCurPlayStore = create<CurPlayStore>()(persist((set, get) => ({
    curPlay: null,
    setCurPlay: curPlay => set({ curPlay }),
    addToNextPlay: (songId) => {
        const curPlay = get().curPlay;

        // 如果当前没有播放或播放列表为空，则创建新的播放列表
        if (!curPlay || !curPlay.list || curPlay.list.length === 0) {
            const song = getSongById(songId);
            set({
                curPlay: {
                    list: [song],
                    song,
                    currentTime: 0,
                    duration: 0,
                    isPlaying: false,
                    playMode: curPlay?.playMode || 'repeat',
                    buffered: 0,
                    isBuffering: true,
                },
            });
            return;
        }

        if (curPlay.song.songId === songId) {
            return;
        }

        const newList = [...curPlay.list];

        // 如果 list 中已有 song, 则变更其位置到下一首
        const existingIndex = curPlay.list.findIndex(s => s.songId === songId);
        if (existingIndex !== -1) {
            const song = getSongById(songId);
            newList.splice(existingIndex, 1);
            const curPlayIndex = curPlay.list.findIndex(s => s.songId === curPlay.song.songId);
            newList.splice(curPlayIndex + 1, 0, song); // 插入到下一首位置
            set({ curPlay: { ...curPlay, list: newList } });
            return;
        }
        // 否则直接插入到下一首位置
        const curPlayIndex = curPlay.list.findIndex(s => s.songId === curPlay.song.songId);
        newList.splice(curPlayIndex + 1, 0, getSongById(songId));
        set({ curPlay: { ...curPlay, list: newList } });
    },
    play: (songId) => {
        const curPlay = get().curPlay;

        // 如果当前没有播放或播放列表为空，则创建新的播放列表并开始播放
        if (!curPlay || !curPlay.list || curPlay.list.length === 0) {
            const song = getSongById(songId);
            set({
                curPlay: {
                    list: [song],
                    song,
                    currentTime: 0,
                    duration: 0,
                    isPlaying: true,
                    playMode: curPlay?.playMode || 'repeat',
                    buffered: 0,
                    isBuffering: true,
                },
            });
            return;
        }

        if (curPlay.song.songId === songId) {
            return;
        }

        const newList = [...curPlay.list];
        const song = getSongById(songId);
        const existingIndex = newList.findIndex(s => s.songId === songId);

        if (existingIndex === -1) {
            // 如果 list 中没有, 插入到当前播放位置之后
            const curPlayIndex = newList.findIndex(s => s.songId === curPlay.song.songId);
            newList.splice(curPlayIndex + 1, 0, song);
        }

        // 更新状态：修改当前歌曲和列表
        set({
            curPlay: {
                ...curPlay,
                song,
                list: newList,
                currentTime: 0,
                duration: 0,
                buffered: 0,
                isPlaying: true,
                isBuffering: true,
            },
        });
    },
    playList: (list) => {
        if (!list || list.length === 0) return;

        const prevPlay = get().curPlay;

        // 如果是同一个播放列表，且已经在播放，则不做任何操作
        if (isSamePlayList(prevPlay?.list || [], list)) {
            if (prevPlay?.isPlaying === false) {
                set({ curPlay: { ...prevPlay, isPlaying: true } });
            }
            return;
        }

        // playMode 继承原来的状态
        const playMode = prevPlay ? prevPlay.playMode : 'repeat';

        set({
            curPlay: {
                list,
                playMode,
                song: list[0],
                currentTime: 0,
                duration: 0,
                isPlaying: true,
                buffered: 0,
                isBuffering: true,
            },
        });
    },
    removeFromPlayList: (songId) => {
        const curPlay = get().curPlay;
        if (!curPlay || !curPlay.list || curPlay.list.length === 0) {
            return;
        }

        const newList = curPlay.list.filter(s => s.songId !== songId);

        // 如果移除后列表为空，清空播放状态
        if (newList.length === 0) {
            set({ curPlay: null });
            return;
        }

        // 如果移除的是当前播放的歌曲
        if (curPlay.song.songId === songId) {
            const currentIndex = curPlay.list.findIndex(s => s.songId === songId);
            // 选择下一首作为当前歌曲，如果是最后一首则选择第一首
            const nextIndex = currentIndex >= newList.length ? 0 : currentIndex;
            const nextSong = newList[nextIndex];

            set({
                curPlay: {
                    ...curPlay,
                    list: newList,
                    song: nextSong,
                    currentTime: 0,
                    duration: 0,
                    buffered: 0,
                    isBuffering: true,
                },
            });
            return;
        }

        // 移除的不是当前播放歌曲，只更新列表
        set({ curPlay: { ...curPlay, list: newList } });
    },
    playPrev: () => {
        const curPlay = get().curPlay;
        if (!curPlay || !curPlay.list || curPlay.list.length === 0) {
            return;
        }

        const currentIndex = curPlay.list.findIndex(s => s.songId === curPlay.song.songId);
        if (currentIndex === -1) {
            return;
        }

        let prevIndex: number;

        if (curPlay.playMode === 'shuffle') {
            // 随机模式：随机选择一首（排除当前）
            if (curPlay.list.length === 1) {
                prevIndex = 0;
            } else {
                do {
                    prevIndex = Math.floor(Math.random() * curPlay.list.length);
                } while (prevIndex === currentIndex);
            }
        } else {
            // 列表循环模式：上一首，如果是第一首则循环到最后一首
            // 即使是单曲循环, 用户点击跳转也应跳转
            prevIndex = currentIndex === 0 ? curPlay.list.length - 1 : currentIndex - 1;
        }

        const prevSong = curPlay.list[prevIndex];
        set({
            curPlay: {
                ...curPlay,
                song: prevSong,
                currentTime: 0,
                duration: 0,
                isPlaying: true,
                buffered: 0,
                isBuffering: true,
            },
        });
    },
    playNext: (auto: boolean = false) => {
        const curPlay = get().curPlay;
        if (!curPlay || !curPlay.list || curPlay.list.length === 0) {
            return;
        }

        const currentIndex = curPlay.list.findIndex(s => s.songId === curPlay.song.songId);
        if (currentIndex === -1) {
            return;
        }

        let nextIndex: number;

        if (curPlay.playMode === 'shuffle') {
            // 随机模式：随机选择一首（排除当前）
            if (curPlay.list.length === 1) {
                nextIndex = 0;
            } else {
                do {
                    nextIndex = Math.floor(Math.random() * curPlay.list.length);
                } while (nextIndex === currentIndex);
            }
        } else {
            // 区分是否是自动下一首, 如果是自动下一首且是单曲循环模式, 则保持当前歌曲不变
            if (auto && curPlay.playMode === 'repeat-one') {
                nextIndex = currentIndex;
            } else {
                // 列表循环模式：下一首，如果是最后一首则循环到第一首
                nextIndex = currentIndex === curPlay.list.length - 1 ? 0 : currentIndex + 1;
            }
        }

        const nextSong = curPlay.list[nextIndex];
        const keepMeta = auto && curPlay.playMode === 'repeat-one';
        set({
            curPlay: {
                ...curPlay,
                song: nextSong,
                currentTime: 0,
                duration: keepMeta ? curPlay.duration : 0,
                isPlaying: true,
                buffered: keepMeta ? curPlay.buffered : 0,
                isBuffering: keepMeta ? curPlay.isBuffering : true,
            },
        });
    },
    stopPlay: () => {
        const curPlay = get().curPlay;
        if (!curPlay) return;
        set({ curPlay: { ...curPlay, isPlaying: false } });
    },
    nextPlayMode: () => {
        const curPlay = get().curPlay;
        if (!curPlay) return;
        const nextMode = playModeNext[curPlay.playMode] || 'repeat';
        set({ curPlay: { ...curPlay, playMode: nextMode } });
    },
    seekTo: (time) => {
        const curPlay = get().curPlay;
        if (!curPlay) return;
        const duration = curPlay.duration || 0;
        const boundedTime = duration ? Math.min(Math.max(time, 0), duration) : Math.max(time, 0);
        set({ curPlay: { ...curPlay, currentTime: boundedTime } });
    },
}), {
    name: 'cur-play-storage',
}));

export function useCurPlay() {
    return useCurPlayStore(state => state.curPlay);
}

export function useSetCurPlay() {
    return useCurPlayStore(state => state.setCurPlay);
}

/** 添加到下一首播放 */
export function useAddToNextPlay() {
    const toast = useToast();
    const add = useCurPlayStore(state => state.addToNextPlay);
    return (songId: number) => {
        toast('已添加到下一首播放');
        add(songId);
    };
}

/** 播放某个单曲 */
export function usePlay() {
    return useCurPlayStore(state => state.play);
}

/** 播放某个歌单 */
export function usePlayList() {
    return useCurPlayStore(state => state.playList);
}

/** 从播放列表中移除某个歌曲 */
export function useRemoveFromPlayList() {
    return useCurPlayStore(state => state.removeFromPlayList);
}

/** 播放上一首歌曲 */
export function usePlayPrev() {
    return useCurPlayStore(state => state.playPrev);
}

/** 播放下一首歌曲 */
export function usePlayNext() {
    return useCurPlayStore(state => state.playNext);
}

/** 停止播放 */
export function useStopPlay() {
    return useCurPlayStore(state => state.stopPlay);
}

/** 播放/暂停 */
export function useTogglePlay() {
    const curPlay = useCurPlayStore(state => state.curPlay);
    const setCurPlay = useCurPlayStore(state => state.setCurPlay);

    return () => {
        if (!curPlay) return;
        setCurPlay({ ...curPlay, isPlaying: !curPlay.isPlaying });
    };
}

/** 当前歌曲跳转到指定时间 */
export function useSeekTo() {
    return useCurPlayStore(state => state.seekTo);
}

/** 切换到下一种播放模式 */
export function useNextPlayMode() {
    return useCurPlayStore(state => state.nextPlayMode);
}
