import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { NavLink, useLocation } from 'react-router';
import { Drawer } from 'vaul';
import SmoothToggle from '@/components/smooth-toggle';
import PlayDrawer from '@/components/play-drawer';
import PlayListDrawer from '@/components/play-list-drawer';
import { cn, getAlbumById } from '@/utils';
import { useCurPlay, useTogglePlay } from '@/stores/cur-play';
import { useDrawerBackStack } from '@/hooks/use-drawer-back-stack';

import IconAlbum from '@/icons/album.svg?react';
import IconAlbumSolid from '@/icons/album-solid.svg?react';
import IconLibrary from '@/icons/library.svg?react';
import IconLibrarySolid from '@/icons/library-solid.svg?react';
import IconPlayList from '@/icons/playlist.svg?react';
import IconData from '@/icons/data.svg?react';
import IconDataSolid from '@/icons/data-solid.svg?react';
import IconPlay from '@/icons/play.svg?react';
import IconPause from '@/icons/pause.svg?react';

const navList = [
    {
        iconInActive: <IconAlbum className="size-7 mb-1" />,
        iconActive: <IconAlbumSolid className="size-7 mb-1" />,
        label: '专辑',
        to: '/',
    },
    {
        iconInActive: <IconLibrary className="size-7 mb-1" />,
        iconActive: <IconLibrarySolid className="size-7 mb-1" />,
        label: '歌曲库',
        to: '/library',
    },
    {
        iconInActive: <IconData className="size-7 mb-1" />,
        iconActive: <IconDataSolid className="size-7 mb-1" />,
        label: '存储',
        to: '/storage',
    },
];

const hideNavBarPaths = [
    /\/album\/.+/, // 专辑页
    /\/like/, // 我的喜欢
    /\/random/, // 今日随机
];

export default function Footer() {
    const location = useLocation();

    const curPlay = useCurPlay();
    const album = useMemo(() => getAlbumById(curPlay?.song.albumId ?? 0), [curPlay?.song.albumId]);

    const togglePlay = useTogglePlay();

    const progressPercent = curPlay?.duration ? (curPlay.currentTime / curPlay.duration) * 100 : 0;
    const bufferedPercent = curPlay?.duration ? (curPlay.buffered / curPlay.duration) * 100 : 0;
    const buffering = Boolean(curPlay?.isBuffering && curPlay?.isPlaying);

    const [isPlayDrawerOpen, setPlayDrawerOpen] = useState(false);
    const [isPlayListDrawerOpen, setPlayListDrawerOpen] = useState(false);

    // 将 Footer 底部的两个 Drawer 接入返回栈
    useDrawerBackStack(isPlayDrawerOpen, () => setPlayDrawerOpen(false));
    useDrawerBackStack(isPlayListDrawerOpen, () => setPlayListDrawerOpen(false));
    // 判断当前路径是否匹配隐藏导航栏的路径
    const isHideNavBar = hideNavBarPaths.some(re => re.test(location.pathname));

    const handlePlayDrawerOpenChange = (open: boolean) => {
        setPlayDrawerOpen(open);
    };

    const handlePlayListDrawerOpenChange = (open: boolean) => {
        setPlayListDrawerOpen(open);
    };

    return (
        <motion.div
            className="fixed left-0 right-0 bg-[#121212] bottom-0"
            animate={{ y: isHideNavBar ? 68 : 0 }}
            transition={{ duration: 0.18, type: 'spring', stiffness: 300, damping: 30 }}
        >
            {/* current play */}
            {curPlay && (
                <Drawer.Root
                    autoFocus
                    open={isPlayDrawerOpen}
                    onOpenChange={handlePlayDrawerOpenChange}
                >
                    <div className="relative flex items-center">
                        <Drawer.Trigger asChild>
                            <div className="w-full">
                                <div className="flex items-center p-2">
                                    <img
                                        className="size-10 mr-2 rounded"
                                        src={album.cover}
                                    />
                                    <div>
                                        <div className="text-sm">{curPlay.song.name}</div>
                                        <div className="text-stone-200 text-xs">{album.name}</div>
                                    </div>
                                </div>

                                {/* progress */}
                                <div className={cn('h-0.5 bg-stone-700 relative overflow-hidden', { 'animate-pulse': buffering })}>
                                    <div
                                        className="absolute inset-y-0 left-0 bg-stone-500/70"
                                        style={{ width: `${Math.min(bufferedPercent, 100)}%` }}
                                    />
                                    <div
                                        className="absolute inset-y-0 left-0 bg-stone-50"
                                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </Drawer.Trigger>

                        <div className="absolute flex items-center gap-4 pr-2 right-0">
                            <motion.button
                                className="relative"
                                whileTap={{ scale: 0.97 }}
                                onTap={togglePlay}
                            >
                                <SmoothToggle
                                    inActive={<IconPlay className="size-8" />}
                                    active={<IconPause className="size-8" />}
                                    isActive={Boolean(curPlay.isPlaying)}
                                />
                            </motion.button>
                            <Drawer.Root
                                autoFocus
                                open={isPlayListDrawerOpen}
                                onOpenChange={handlePlayListDrawerOpenChange}
                            >
                                <Drawer.Trigger asChild>
                                    <motion.button whileTap={{ scale: 0.97 }}>
                                        <IconPlayList className="size-6" />
                                    </motion.button>
                                </Drawer.Trigger>
                                <PlayListDrawer />
                            </Drawer.Root>
                        </div>
                    </div>

                    {/* 播放器面板 */}
                    <PlayDrawer />
                </Drawer.Root>
            )}

            {/* nav bar */}
            <div className="flex justify-between h-[68px]">
                {navList.map(nav => (
                    <NavLink
                        key={nav.to}
                        to={nav.to}
                        className={({ isActive }) => cn(
                            'flex-1 relative flex flex-col justify-center items-center active:scale-97',
                            { 'text-stone-200': !isActive },
                        )}
                    >
                        <SmoothToggle
                            inActive={nav.iconInActive}
                            active={nav.iconActive}
                            isActive={location.pathname === nav.to}
                        />
                        <span className="text-xs">{nav.label}</span>
                    </NavLink>
                ))}
            </div>
        </motion.div>
    );
}
