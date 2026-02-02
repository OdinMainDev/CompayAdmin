import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './i18n';
import { AppRouter } from '@/features/router/AppRouter';
import { AuthProvider } from '@/features/auth/AuthProvider';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <AppRouter />
    <ToastContainer position="top-right" newestOnTop />
  </AuthProvider>,
);
