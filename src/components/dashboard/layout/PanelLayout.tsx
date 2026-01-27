import '@/assets/scss/dashboard/volt.scss';

import { Outlet } from 'react-router-dom';
import ScrollToTop from '@/components/base/ScrollToTop';

export default function PanelLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}
