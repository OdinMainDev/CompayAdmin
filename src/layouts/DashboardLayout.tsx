import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';
import { RouteGroup } from '../router/routes';

interface DashboardLayoutProps {
  routeGroups: RouteGroup[];
}

const DashboardLayout = ({ routeGroups }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="d-flex">
      <Sidebar routeGroups={routeGroups} open={sidebarOpen} onToggle={handleSidebarToggle} />
      <div className="content w-100">
        <Topbar onToggleSidebar={handleSidebarToggle} />
        <Container fluid className="pb-5">
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default DashboardLayout;
