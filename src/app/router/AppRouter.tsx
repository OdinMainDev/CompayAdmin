import { RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import { Preloader } from '../../pages/landing/components/Preloader';
import { router } from './routes';

const AppRouter = () => (
  <Suspense fallback={<Preloader />}>
    <RouterProvider router={router} />
  </Suspense>
);

export { AppRouter };