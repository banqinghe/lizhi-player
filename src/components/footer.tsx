import { NavLink, useLocation } from 'react-router';
import SmoothToggle from '@/components/smooth-toggle';
import PlayButton from '@/components/play-button';
import { cn } from '@/utils';
import { useCurPlay } from '@/stores/cur-play';

import IconAlbum from '@/icons/album.svg?react';
import IconAlbumSolid from '@/icons/album-solid.svg?react';
import IconLibrary from '@/icons/library.svg?react';
import IconLibrarySolid from '@/icons/library-solid.svg?react';
import IconPlayList from '@/icons/playlist.svg?react';
import IconUser from '@/icons/user.svg?react';
import IconUserSolid from '@/icons/user-solid.svg?react';

const navList = [
    {
        iconInActive: <IconAlbum className="w-7 h-7 mb-1" />,
        iconActive: <IconAlbumSolid className="w-7 h-7 mb-1" />,
        label: '专辑',
        to: '/',
    },
    {
        iconInActive: <IconLibrary className="w-7 h-7 mb-1" />,
        iconActive: <IconLibrarySolid className="w-7 h-7 mb-1" />,
        label: '歌曲库',
        to: '/library',
    },
    {
        iconInActive: <IconUser className="w-7 h-7 mb-1" />,
        iconActive: <IconUserSolid className="w-7 h-7 mb-1" />,
        label: '我的',
        to: '/user',
    },
];

export default function Footer() {
    const location = useLocation();

    const curPlay = useCurPlay();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#121212]">
            {/* current play */}
            {curPlay && (
                <div className="">
                    <div className="flex items-center p-2">
                        <img
                            className="w-10 h-10 mr-2 rounded"
                            src={curPlay.album.cover}
                        />
                        <div>
                            <div className="text-sm">{curPlay.song.name}</div>
                            <div className="text-stone-200 text-xs">{curPlay.album.name}</div>
                        </div>
                        <div className="flex items-center gap-4 pr-2 ml-auto">
                            <PlayButton
                                isPlaying={curPlay.isPlaying}
                                onClick={() => {}}
                                iconClassName="w-7 h-7"
                            />
                            <button>
                                <IconPlayList className="w-7 h-7" />
                            </button>
                        </div>
                    </div>

                    <div className="h-0.5 bg-stone-700">
                        <div className="bg-stone-50 w-1/3 h-full" />
                    </div>
                </div>
            )}

            {/* nav bar */}
            <div className="flex justify-between">
                {navList.map(nav => (
                    <NavLink
                        key={nav.to}
                        to={nav.to}
                        className={({ isActive }) => cn(
                            'flex-1 py-2.5 relative flex flex-col items-center active:scale-97',
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
        </div>
    );
}
