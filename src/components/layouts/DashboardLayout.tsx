import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../navigation/Sidebar';
import Topbar from '../navigation/Topbar';
import { useRouteGroups } from '../../app/router/hooks/useRouteGroups';



const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);
  const routes = useRouteGroups();
 
   if (!routes) {
    return <Navigate to="/auth/login" replace />;
   }
  

  return (
    <div className="d-flex">
      <Sidebar routeGroups={routes} open={sidebarOpen} onToggle={handleSidebarToggle} />
      <div className="content w-100 min-[768px]:max-w-[calc(100%_-_260px)] min-[768px]:ml-auto max-[768px]:!px-0">
        <Topbar/>
        <div className="content-body min-[768px]:px-3 pb-4">
          <Container fluid className="pb-3">
            <Outlet />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
