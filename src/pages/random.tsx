import { useMemo } from 'react';
import { getRandomSong } from '@/utils';
import BackBar from '@/components/back-bar';
import PlayListButton from '@/components/play-list-button';
import SongList from '@/components/song-list';

import diceUrl from '@/images/dice.webp';

export default function RandomPage() {
    const songs = useMemo(() => getRandomSong(), []);

    return (
        <div className="pb-16">
            <BackBar title="返回" />
            <div className="relative pt-10 py-8 mx-4 rounded-lg mb-4" style={{ background: `no-repeat url(${diceUrl}) center / 100%` }}>
                <h1 className="text-3xl text-center font-bold">今日随机</h1>
                <div className="flex justify-center mt-4">
                    <PlayListButton
                        className="mr-2 flex items-center before:content-[''] before:absolute before:inset-0"
                        iconClassName="size-7"
                        list={songs}
                        content={<span>播放全部</span>}
                    />
                </div>
            </div>
            <SongList showAlbumName className="px-4" list={songs} />
        </div>
    );
}
