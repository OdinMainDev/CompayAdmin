import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';
import { type RouteGroup } from '../router/routes';

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
        <Topbar/>
        <div className="content-body px-3 pb-4">
          <Container fluid className="pb-3">
            <Outlet />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
