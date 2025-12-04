import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Accordion, Button, Image, Nav } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { RouteGroup, AppRoute } from '../../router/routes';
import Logo from '../../assets/volt/technologies/react-hero-logo.svg';

interface SidebarProps {
  routeGroups: RouteGroup[];
  open: boolean;
  onToggle: () => void;
}

const Sidebar = ({ routeGroups, open, onToggle }: SidebarProps) => {
  const location = useLocation();

  const isActive = (route?: AppRoute) => {
    if (!route?.path) return false;
    return location.pathname.startsWith(`/panel/${route.path}`);
  };

  const renderNavLink = (route: AppRoute) => {
    if (!route.path) {
      return null;
    }

    const handleNavClick = () => {
      if (window.innerWidth < 768) {
        onToggle();
      }
    };

    return (
      <Nav.Item key={route.name} className={isActive(route) ? 'active' : ''}>
        <NavLink
          to={`/panel/${route.path}`}
          className={({ isActive: active }) =>
            `nav-link d-flex align-items-center ${active ? 'active' : ''}`
          }
          end={!route.pages}
          onClick={handleNavClick}
        >
          {route.icon && (
            <span className="sidebar-icon">
              <FontAwesomeIcon icon={route.icon} />
            </span>
          )}
          <span className="sidebar-text">{route.label}</span>
        </NavLink>
      </Nav.Item>
    );
  };

  const renderNested = (route: AppRoute) => {
    const hasChild = route.pages && route.pages.length > 0;
    if (!hasChild) {
      return renderNavLink(route);
    }

    const childActive = route.pages?.some((child) => isActive(child)) ?? false;

    return (
      <Accordion as={Nav.Item} key={route.name} defaultActiveKey={childActive ? route.name : undefined}>
        <Accordion.Item eventKey={route.name}>
          <Accordion.Button as="div" className="nav-link d-flex justify-content-between align-items-center">
            <span className="d-flex align-items-center">
              {route.icon && (
                <span className="sidebar-icon">
                  <FontAwesomeIcon icon={route.icon} />
                </span>
              )}
              <span className="sidebar-text">{route.label}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level pt-0">
            <Nav className="flex-column">{route.pages?.map((child) => renderNested(child))}</Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  return (
    <div className={`sidebar bg-primary text-white ${open ? 'd-block' : 'd-none d-md-block'}`}>
      <div className="sidebar-inner px-4 pt-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <NavLink to="/panel/dashboard" className="navbar-brand text-white d-flex align-items-center">
            <Image src={Logo} height={34} className="me-2" />
            <span className="fw-bold">Volt Merchant</span>
          </NavLink>
          <Button
            variant="link"
            className="text-white d-md-none sidebar-toggle p-0"
            onClick={onToggle}
            aria-label="Toggle sidebar"
          >
            <FontAwesomeIcon icon={faBars} />
          </Button>
        </div>
        <Nav className="flex-column pt-2">
          {routeGroups.map((group) => (
            <div key={group.label} className="mb-2">
              {group.label && (
                <div className="sidebar-heading text-white-50 text-uppercase fw-semibold small mb-2">
                  {group.label}
                </div>
              )}
              {group.pages.map((route) => renderNested(route))}
            </div>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
