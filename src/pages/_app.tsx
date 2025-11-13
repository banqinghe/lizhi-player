import { Outlet } from 'react-router';
import { Drawer } from 'vaul';
import Footer from '@/components/footer';
import PlayDrawer from '@/components/play-drawer';

export default function App() {
    return (
        <Drawer.Root>
            <div className="pb-32">
                <Outlet />
            </div>
            <Footer />
            <PlayDrawer />
        </Drawer.Root>
    );
}
