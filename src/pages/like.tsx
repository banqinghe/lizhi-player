import { useLikeList } from '@/stores/like-list';
import BackBar from '@/components/back-bar';
import PlayListButton from '@/components/play-list-button';
import SongList from '@/components/song-list';

import likeUrl from '@/images/like.jpeg';

export default function LikePage() {
    const likeList = useLikeList();

    return (
        <div className="pb-16">
            <BackBar title="返回" />
            <div className="relative pt-10 py-8 mx-4 rounded-lg mb-4" style={{ background: `no-repeat url(${likeUrl}) center / 100%` }}>
                <h1 className="text-3xl text-center font-bold">我的喜欢</h1>
                {likeList.length > 0 && (
                    <div className="flex justify-center mt-4">
                        <PlayListButton
                            className="mr-2 flex items-center before:content-[''] before:absolute before:inset-0"
                            iconClassName="size-7"
                            list={likeList}
                            content={<span>播放全部</span>}
                        />
                    </div>
                )}
            </div>
            <div>
                {likeList.length === 0
                    ? (
                            <div className="text-center text-stone-400 mt-56">
                                你还没有喜欢的歌曲
                            </div>
                        )
                    : (
                            <SongList showAlbumName className="px-4" list={likeList} />
                        )}
            </div>
        </div>
    );
}
