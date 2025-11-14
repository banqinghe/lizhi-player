import { Drawer } from 'vaul';
import { usePlayListOpen, useSetPlayListOpen } from '@/stores/drawer';
import { useCurPlay, useSetCurPlay } from '@/stores/cur-play';
import { cn, getAlbumById } from '@/utils';
import PlayModeSwitch from '@/components/play-mode-switch';

import IconClose from '@/icons/close.svg?react';
import IconPlaying from '@/icons/playing.svg?react';

export default function PlayListDrawer() {
    const curPlay = useCurPlay();
    const setCurPlay = useSetCurPlay();

    const open = usePlayListOpen();
    const setOpen = useSetPlayListOpen();

    // Only render the drawer root when open to avoid interfering with other Drawer roots.
    if (!open) return null;

    return (
        <Drawer.Root
            autoFocus
            open={open}
            onOpenChange={setOpen}
        >
            <Drawer.Portal>
                <Drawer.Overlay
                    className="fixed inset-0 z-100"
                    onClick={() => setOpen(false)}
                />
                <Drawer.Content
                    aria-describedby={undefined}
                    className="fixed top-1/4 bottom-0 left-0 right-0 outline-none z-100 rounded-2xl shadow overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[#121212] pointer-events-none -z-10" />
                    <div className="flex flex-col size-full pt-3">
                        <div className="flex justify-center items-center mb-6">
                            <Drawer.Handle />
                        </div>

                        <div className="flex-1 overflow-auto">
                            <div className="flex items-center sticky top-0 mb-6 bg-[#121212]">
                                <Drawer.Title className="font-bold text-stone-50 text px-4">
                                    当前播放（
                                    {curPlay?.list.length}
                                    ）
                                </Drawer.Title>
                                <PlayModeSwitch
                                    withText
                                    className="flex items-center mr-4 px-2 py-1 ml-auto bg-stone-800 rounded"
                                    iconClassName="size-4"
                                    playMode={curPlay?.playMode || 'repeat'}
                                    onChange={() => {}}
                                />
                            </div>
                            <ul className="px-2">
                                {curPlay?.list.map(song => (
                                    <li
                                        key={song.songId}
                                        className={cn('flex items-center px-2 py-2 whitespace-nowrap', { 'bg-stone-800 rounded-lg': song.songId === curPlay.song.songId })}
                                        onClick={() => {}}
                                    >
                                        <img className="size-10 mr-4" src={getAlbumById(song.albumId).cover} alt={song.name} />
                                        {song.name}
                                        <span className="text-sm ml-1 text-stone-400 truncate">
                                            {'· '}
                                            {getAlbumById(song.albumId).name}
                                        </span>
                                        {song.songId === curPlay.song.songId && (
                                            <IconPlaying className="size-3 ml-2" />
                                        )}
                                        <button className="ml-auto">
                                            <IconClose className="size-5 text-stone-400" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
