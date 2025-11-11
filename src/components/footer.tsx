import { Link } from 'react-router';
import IconAlbum from '@/icons/album.svg?react';
import IconLibrary from '@/icons/library.svg?react';
import IconUser from '@/icons/user.svg?react';

interface FooterProps {
    className?: string;
}

export default function Footer(props: FooterProps) {
    const { className } = props;

    return (
        <div className={className}>
            <Link to="/">
                <IconAlbum />
                专辑
            </Link>
            <Link to="/library">
                <IconLibrary />
                歌曲库
            </Link>
            <Link to="/personal">
                <IconUser />
                我的
            </Link>
        </div>
    );
}
