import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './i18n';
import { AppRouter } from '@/app/router/AppRouter';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
    <ToastContainer position="top-right" newestOnTop />
  </StrictMode>,
);
