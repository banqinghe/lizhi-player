import { Outlet } from 'react-router';
import Footer from '@/components/footer';
import PlayDrawer from '@/components/play-drawer';
import PlayListDrawer from '@/components/play-list-drawer';

export default function App() {
    return (
        <>
            <Outlet />
            <Footer />
            <PlayDrawer />
            <PlayListDrawer />
        </>
    );
}
