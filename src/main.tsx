import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Routes } from '@generouted/react-router';
import { registerSW } from 'virtual:pwa-register';
import '@/player/audio-controller';

import './global.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Routes />
    </StrictMode>,
);

registerSW({ immediate: true });
