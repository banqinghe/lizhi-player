import { useState } from 'react';
import { Drawer } from 'vaul';
import { usePlayDrawerOpen, useSetPlayDrawerOpen } from '@/stores/drawer';
import { useSetPlayListOpen } from '@/stores/drawer';
import { motion } from 'motion/react';
import { useCurPlay, useSetCurPlay } from '@/stores/cur-play';
import LikeButton from '@/components/like-button';
import PlaySlider from '@/components/play-slider';
import PlayModeSwitch from '@/components/play-mode-switch';
import SmoothToggle from '@/components/smooth-toggle';
import type { PlayMode } from '@/types';

import IconChevronDown from '@/icons/chevron-down.svg?react';
import IconSkipPrevious from '@/icons/skip-previous.svg?react';
import IconSkipNext from '@/icons/skip-next.svg?react';
import IconPlayCircle from '@/icons/play-circle.svg?react';
import IconPauseCircle from '@/icons/pause-circle.svg?react';
import IconPlayList from '@/icons/playlist.svg?react';

export default function PlayDrawer() {
    const curPlay = useCurPlay();
    const setCurPlay = useSetCurPlay();
    const open = usePlayDrawerOpen();
    const setOpen = useSetPlayDrawerOpen();

    // temp
    const [playMode, setPlayMode] = useState<PlayMode>('repeat');
    const setPlayListOpen = useSetPlayListOpen();

    if (!open) return null;

    return (
        <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-100" onClick={() => setOpen(false)} />
                <Drawer.Content
                    className="top-0 fixed bottom-0 left-0 right-0 outline-none z-100"
                    style={{ background: `url(${curPlay?.album.cover}) center / auto 100% #121212` }}
                >
                    <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />
                    <div className="flex flex-col backdrop-blur-xl size-full px-4 pt-3">
                        <div className="flex justify-between items-center">
                            <Drawer.Close asChild>
                                <button><IconChevronDown className="size-7" /></button>
                            </Drawer.Close>
                            <Drawer.Handle />
                            <div className="size-7" />
                        </div>

                        <div className="flex-1 flex justify-center items-center">
                            <img className="rounded" src={curPlay?.album.cover} alt={`${curPlay?.album.name} album cover`} />
                        </div>

                        <div className="pb-12 px-2">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <Drawer.Title className="text-lg mb-1">{curPlay?.song.name}</Drawer.Title>
                                    <Drawer.Description className="text-sm text-stone-400">{curPlay?.album.name}</Drawer.Description>
                                </div>
                                <LikeButton songId={curPlay?.song.songId ?? 0} />
                            </div>

                            <PlaySlider className="mb-8" />

                            <div className="flex justify-between">
                                <PlayModeSwitch playMode={playMode} onChange={setPlayMode} />
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onTap={() => {}}
                                >
                                    <IconSkipPrevious className="size-14" />
                                </motion.button>
                                <motion.button
                                    className="relative"
                                    whileTap={{ scale: 0.97 }}
                                    onTap={() => setCurPlay(play => play ? { ...play, isPlaying: !play.isPlaying } : play)}
                                >
                                    <SmoothToggle
                                        inActive={<IconPlayCircle className="size-16" />}
                                        active={<IconPauseCircle className="size-16" />}
                                        isActive={Boolean(curPlay?.isPlaying)}
                                    />
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onTap={() => {}}
                                >
                                    <IconSkipNext className="size-14" />
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onTap={() => setPlayListOpen(true)}
                                >
                                    <IconPlayList className="size-8" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
