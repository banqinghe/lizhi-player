import { Outlet } from 'react-router';
import { Toast } from '@base-ui-components/react/toast';
import Footer from '@/components/footer';
import { ToastPortal } from '@/components/toast';

export default function App() {
    return (
        <Toast.Provider>
            <Outlet />
            <Footer />
            <ToastPortal />
        </Toast.Provider>
    );
}
