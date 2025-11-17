import { useMemo } from 'react';
import { Drawer } from 'vaul';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useCurPlay, usePlayNext, usePlayPrev, useTogglePlay } from '@/stores/cur-play';
import { getAlbumById } from '@/utils';
import LikeButton from '@/components/like-button';
import PlaySlider from '@/components/play-slider';
import PlayModeSwitch from '@/components/play-mode-switch';
import SmoothToggle from '@/components/smooth-toggle';
import PlayListDrawer from '@/components/play-list-drawer';

import IconChevronDown from '@/icons/chevron-down.svg?react';
import IconSkipPrevious from '@/icons/skip-previous.svg?react';
import IconSkipNext from '@/icons/skip-next.svg?react';
import IconPlayCircle from '@/icons/play-circle.svg?react';
import IconPauseCircle from '@/icons/pause-circle.svg?react';
import IconPlayList from '@/icons/playlist.svg?react';

export default function PlayDrawer() {
    const curPlay = useCurPlay();
    const playPrev = usePlayPrev();
    const playNext = usePlayNext();
    const togglePlay = useTogglePlay();

    const album = useMemo(() => getAlbumById(curPlay?.song.albumId ?? 0), [curPlay?.song.albumId]);

    return (
        <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-100" />
            <Drawer.Content
                className="top-0 fixed bottom-0 left-0 right-0 outline-none z-100"
                style={{ background: `url(${album.cover}) center / auto 100% #121212` }}
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
                        <img className="rounded" src={album.cover} alt={`${album.name} album cover`} />
                    </div>

                    <div className="pb-12 px-2">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <Drawer.Title className="text-lg mb-1">{curPlay?.song.name}</Drawer.Title>
                                <Drawer.Description
                                    className="text-sm text-stone-400"
                                    asChild
                                >
                                    <Drawer.Close asChild>
                                        <Link to={`/album/${album.albumId}`}>
                                            {album.name}
                                        </Link>
                                    </Drawer.Close>
                                </Drawer.Description>
                            </div>
                            <LikeButton songId={curPlay?.song.songId ?? 0} />
                        </div>

                        <PlaySlider className="mb-8" />

                        <div className="flex justify-between">
                            <PlayModeSwitch />
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onTap={playPrev}
                            >
                                <IconSkipPrevious className="size-14" />
                            </motion.button>
                            <motion.button
                                className="relative"
                                whileTap={{ scale: 0.97 }}
                                onTap={togglePlay}
                            >
                                <SmoothToggle
                                    inActive={<IconPlayCircle className="size-16" />}
                                    active={<IconPauseCircle className="size-16" />}
                                    isActive={Boolean(curPlay?.isPlaying)}
                                />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onTap={playNext}
                            >
                                <IconSkipNext className="size-14" />
                            </motion.button>

                            <Drawer.NestedRoot autoFocus>
                                <Drawer.Trigger asChild>
                                    <motion.button whileTap={{ scale: 0.97 }}>
                                        <IconPlayList className="size-8" />
                                    </motion.button>
                                </Drawer.Trigger>
                                <PlayListDrawer />
                            </Drawer.NestedRoot>
                        </div>
                    </div>
                </div>
            </Drawer.Content>
        </Drawer.Portal>
    );
}
