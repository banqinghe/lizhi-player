import { getAlbumById } from '@/utils';
import { useCurPlayStore, type CurPlay } from '@/stores/cur-play';
import { getCachedAudioBlob, hasCachedAudio, setCachedAudioBlob } from './audio-cache';

function getBufferedEnd(audio: HTMLAudioElement): number {
    const { buffered } = audio;
    if (!buffered || buffered.length === 0) {
        return 0;
    }
    try {
        return buffered.end(buffered.length - 1);
    } catch {
        return 0;
    }
}

function getArtworkType(url: string): string {
    if (url.endsWith('.png')) {
        return 'image/png';
    }
    if (url.endsWith('.webp')) {
        return 'image/webp';
    }
    return 'image/jpeg';
}

class HtmlAudioController {
    private audio: HTMLAudioElement;
    private pushingTimeFromAudio = false;
    private hasMediaSession = typeof navigator !== 'undefined' && 'mediaSession' in navigator;

    private objectUrl: string | null = null;
    private lastSongId: number | null = null;
    private lastSongUrl: string | null = null;
    private lastSourceFromCache = false;
    private cachingSongIds = new Set<number>();
    private loadToken = 0;

    constructor() {
        this.audio = new Audio();
        this.audio.preload = 'auto';
        this.audio.crossOrigin = 'anonymous';
        this.bindEvents();
        this.observeStore();
        if (this.hasMediaSession) {
            this.setupMediaSessionHandlers();
        }
    }

    private observeStore() {
        useCurPlayStore.subscribe((state, prevState) => {
            this.handleStateChange(state.curPlay, prevState?.curPlay ?? null);
            this.updateMediaSession(state.curPlay);
        });
    }

    private handleStateChange(next: CurPlay | null, prev: CurPlay | null) {
        if (!next) {
            this.audio.pause();
            this.clearObjectUrl();
            this.audio.removeAttribute('src');
            return;
        }

        if (!prev || next.song.songId !== prev.song.songId) {
            void this.loadSource(next);
            return;
        }

        if (next.isPlaying !== prev.isPlaying) {
            if (next.isPlaying) {
                this.safePlay();
            } else {
                this.audio.pause();
            }
        }

        if (!this.pushingTimeFromAudio) {
            const diff = Math.abs(this.audio.currentTime - next.currentTime);
            if (diff > 0.2) {
                this.audio.currentTime = next.currentTime;
            }
        }
    }

    private async loadSource(curPlay: CurPlay) {
        const token = ++this.loadToken;
        const { song } = curPlay;
        this.lastSongId = song.songId;
        this.lastSongUrl = song.url;
        const cachedBlob = await getCachedAudioBlob(song.songId);
        if (token !== this.loadToken) {
            return;
        }
        const isCacheHit = Boolean(cachedBlob);
        const nextSrc = isCacheHit && cachedBlob ? URL.createObjectURL(cachedBlob) : song.url;
        this.replaceObjectUrl(nextSrc, isCacheHit);
        this.lastSourceFromCache = isCacheHit;
        this.audio.currentTime = curPlay.currentTime || 0;
        this.audio.load();
        if (curPlay.isPlaying) {
            this.safePlay();
        }
    }

    private replaceObjectUrl(src: string, isBlob: boolean) {
        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
            this.objectUrl = null;
        }
        this.audio.src = src;
        if (isBlob) {
            this.objectUrl = src;
        }
    }

    private clearObjectUrl() {
        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
            this.objectUrl = null;
        }
    }

    private async cacheSongAfterPlayback(songId: number, url: string) {
        if (this.cachingSongIds.has(songId)) {
            return;
        }
        this.cachingSongIds.add(songId);
        try {
            const alreadyCached = await hasCachedAudio(songId);
            if (alreadyCached) {
                return;
            }
            const response = await fetch(url, { mode: 'cors', credentials: 'omit' });
            if (!response.ok) {
                return;
            }
            const blob = await response.blob();
            if (blob.type && !blob.type.startsWith('audio/')) {
                return;
            }
            await setCachedAudioBlob(songId, blob);
        } catch (error) {
            console.warn(error);
        } finally {
            this.cachingSongIds.delete(songId);
        }
    }

    private bindEvents() {
        this.audio.addEventListener('loadedmetadata', this.handleLoadedMetadata);
        this.audio.addEventListener('timeupdate', this.handleTimeUpdate);
        this.audio.addEventListener('progress', this.handleProgress);
        this.audio.addEventListener('waiting', this.handleWaiting);
        this.audio.addEventListener('canplay', this.handleCanPlay);
        this.audio.addEventListener('playing', this.handlePlaying);
        this.audio.addEventListener('pause', this.handlePause);
        this.audio.addEventListener('ended', this.handleEnded);
        this.audio.addEventListener('error', this.handleError);
    }

    private updateCurPlay(partial: Partial<CurPlay>) {
        useCurPlayStore.setState((state) => {
            if (!state.curPlay) {
                return state;
            }
            return { curPlay: { ...state.curPlay, ...partial } };
        });
    }

    private handleLoadedMetadata = () => {
        const duration = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
        this.updateCurPlay({ duration, buffered: getBufferedEnd(this.audio) });
    };

    private handleTimeUpdate = () => {
        if (!useCurPlayStore.getState().curPlay) {
            return;
        }
        this.pushingTimeFromAudio = true;
        this.updateCurPlay({ currentTime: this.audio.currentTime });
        this.pushingTimeFromAudio = false;
    };

    private handleProgress = () => {
        this.updateCurPlay({ buffered: getBufferedEnd(this.audio) });
    };

    private handleWaiting = () => {
        this.updateCurPlay({ isBuffering: true });
    };

    private handleCanPlay = () => {
        this.updateCurPlay({ isBuffering: false });
    };

    private handlePlaying = () => {
        this.updateCurPlay({ isPlaying: true, isBuffering: false });
    };

    private handlePause = () => {
        this.updateCurPlay({ isPlaying: false });
    };

    private handleEnded = () => {
        if (this.lastSongId != null && this.lastSongUrl && !this.lastSourceFromCache) {
            void this.cacheSongAfterPlayback(this.lastSongId, this.lastSongUrl);
        }
        const playNext = useCurPlayStore.getState().playNext;
        playNext(true);
    };

    private handleError = () => {
        this.audio.pause();
        this.updateCurPlay({ isPlaying: false, isBuffering: false });
    };

    private safePlay() {
        if (!this.audio.src) {
            return;
        }
        this.audio.play().catch(() => {
            this.updateCurPlay({ isPlaying: false });
        });
    }

    private setupMediaSessionHandlers() {
        if (!this.hasMediaSession) {
            return;
        }
        const mediaSession = navigator.mediaSession;
        mediaSession.setActionHandler('play', () => this.setPlayingFromMediaSession(true));
        mediaSession.setActionHandler('pause', () => this.setPlayingFromMediaSession(false));
        mediaSession.setActionHandler('stop', () => {
            const stopPlay = useCurPlayStore.getState().stopPlay;
            stopPlay();
        });
        mediaSession.setActionHandler('previoustrack', () => {
            const playPrev = useCurPlayStore.getState().playPrev;
            playPrev();
        });
        mediaSession.setActionHandler('nexttrack', () => {
            const playNext = useCurPlayStore.getState().playNext;
            playNext();
        });
        mediaSession.setActionHandler('seekto', (details) => {
            if (!details || details.seekTime == null) return;
            const seekTo = useCurPlayStore.getState().seekTo;
            seekTo(details.seekTime);
        });
        mediaSession.setActionHandler('seekforward', (details) => {
            const { curPlay, seekTo } = useCurPlayStore.getState();
            if (!curPlay) return;
            const increment = details?.seekOffset ?? 10;
            seekTo(Math.min(curPlay.currentTime + increment, curPlay.duration || curPlay.currentTime + increment));
        });
        mediaSession.setActionHandler('seekbackward', (details) => {
            const { curPlay, seekTo } = useCurPlayStore.getState();
            if (!curPlay) return;
            const decrement = details?.seekOffset ?? 10;
            seekTo(Math.max(curPlay.currentTime - decrement, 0));
        });
    }

    private setPlayingFromMediaSession(isPlaying: boolean) {
        const { curPlay, setCurPlay } = useCurPlayStore.getState();
        if (!curPlay) {
            return;
        }
        setCurPlay({ ...curPlay, isPlaying });
    }

    private updateMediaSession(curPlay: CurPlay | null) {
        if (!this.hasMediaSession) {
            return;
        }
        const mediaSession = navigator.mediaSession;
        if (!curPlay) {
            mediaSession.metadata = null;
            mediaSession.playbackState = 'none';
            return;
        }
        const album = getAlbumById(curPlay.song.albumId);
        const artworkType = getArtworkType(album.cover);
        mediaSession.metadata = new MediaMetadata({
            title: curPlay.song.name,
            artist: '李志',
            album: album.name,
            artwork: [
                {
                    src: album.cover,
                    sizes: '512x512',
                    type: artworkType,
                },
            ],
        });
    }
}

export const audioController = typeof window !== 'undefined' ? new HtmlAudioController() : null;
