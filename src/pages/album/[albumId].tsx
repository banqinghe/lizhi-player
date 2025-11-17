import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getAlbumById } from '@/utils';
import BackBar from '@/components/back-bar';
import PlayListButton from '@/components/play-list-button';
import SongList from '@/components/song-list';

export default function AlbumPage() {
    const { albumId: albumIdStr } = useParams<{ albumId: string }>();
    const navigate = useNavigate();

    const albumId = Number(albumIdStr);
    const album = getAlbumById(albumId);

    const isBadLink = !albumIdStr || Number.isNaN(albumId) || !album;

    useEffect(() => {
        if (isBadLink) {
            navigate('/404', { replace: true });
        }
    }, [isBadLink, navigate]);

    if (isBadLink) {
        return null;
    }

    return (
        <div>
            <div className="fixed inset-0 -z-10" style={{ background: `no-repeat url(${album.cover}) top center / auto 100% #121212` }} />
            <div
                className="min-h-screen pb-18 backdrop-blur-2xl"
                style={{ background: 'linear-gradient(#12121250 0%, #121212 90%)' }}
            >
                <BackBar title="专辑" />
                <div>
                    <div className="flex justify-center gap-6 px-6 mb-6">
                        <img className="size-36 rounded" src={album.cover} alt={album.name} />
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-semibold">{album.name}</h1>
                            {album.year > 0 && (
                                <div className="text-stone-400 text-sm mt-4">
                                    发行于
                                    {album.year}
                                    年
                                </div>
                            )}
                            <div className="text-stone-400 text-sm mt-1 mb-2">
                                共
                                {album.songs.length}
                                首
                            </div>
                            <PlayListButton
                                className="flex items-center mt-auto pl-2 pr-4 py-1 w-fit bg-stone-50/10 text-stone-300 rounded-full"
                                iconClassName="size-8"
                                list={album.songs}
                                content={<span>播放全部</span>}
                            />
                        </div>
                    </div>
                </div>
                <SongList list={album.songs} className="px-4" />
            </div>
        </div>
    );
}
