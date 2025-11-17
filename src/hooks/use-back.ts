/**
 * @file 如果没有历史记录则返回首页
 */

import { useNavigate } from 'react-router';

export default function useBack() {
    const navigate = useNavigate();
    return () => {
        if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };
}
