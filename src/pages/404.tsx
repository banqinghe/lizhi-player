import { Link } from 'react-router';
import IconRightArrow from '@/icons/right-arrow-alt.svg?react';

export default function NotFoundPage() {
    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center">
            <h1 style={{ fontSize: '2rem' }} className="font-bold mb-4">404 Not Found</h1>
            <Link to="/" className="flex gap-1 border-b">
                返回首页
                <IconRightArrow />
            </Link>
        </div>
    );
}
