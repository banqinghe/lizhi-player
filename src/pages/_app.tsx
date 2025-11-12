import { Outlet } from 'react-router';
import Footer from '@/components/footer';

export default function App() {
    return (
        <>
            <div className="pb-32">
                <Outlet />
            </div>
            <Footer />
        </>
    );
}
