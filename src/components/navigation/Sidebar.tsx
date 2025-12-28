import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, Image, Nav } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { RouteConfig } from '../../app/router/types';

interface SidebarProps {
  routeGroups: RouteConfig;
  open: boolean;
  onToggle: () => void;
}

const Sidebar = ({ routeGroups, open, onToggle }: SidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (route?: RouteConfig) => {
    if (!route?.path) return false;
    return location.pathname.startsWith(`/panel/${route.path}`);
  };

  const renderNavLink = (route: RouteConfig) => {
    if (!route.path) {
      return null;
    }

    const handleNavClick = () => {
      if (window.innerWidth < 768) {
        onToggle();
      }
    };

    return (
      <Nav.Item key={route.id} className={isActive(route) ? 'active' : ''}>
        <NavLink
          to={`/panel/${route.path}`}
          className={({ isActive: active }) =>
            `nav-link d-flex align-items-center ${active ? 'active' : ''}`
          }
          end={!route.children}
          onClick={handleNavClick}
        >
          {route.meta?.icon && (
            <span className="sidebar-icon">
              <FontAwesomeIcon icon={route.meta.icon} />
            </span>
          )}
          {route.meta && (
            <span className="sidebar-text">{t(route.meta.label)}</span>
          )}
        </NavLink>
      </Nav.Item>
    );
  };

  const renderNested = (route: RouteConfig) => {
    const hasChild = route.children && route.children.length > 0;
    if (!hasChild) {
      return renderNavLink(route);
    }

    const childActive = route.children?.some((child) => isActive(child)) ?? false;

    return (
      <Accordion as={Nav.Item} key={route.id} defaultActiveKey={childActive ? route.id : undefined}>
        <Accordion.Item eventKey={route.id}>
          <Accordion.Button as="div" className="nav-link d-flex justify-content-between align-items-center">
            <span className="d-flex align-items-center">
              {route.meta && route.meta.icon && (
                <span className="sidebar-icon">
                  <FontAwesomeIcon icon={route.meta.icon} />
                </span>
              )}
              {route.meta && (
                <span className="sidebar-text">{t(route.meta.label)}</span>
              )}
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level pt-0">
            <Nav className="flex-column">{route.children?.map((child) => renderNested(child))}</Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  return (
    <div className={`sidebar bg-primary text-white ${open ? 'd-block' : 'd-none d-md-block'}`}>
      <div className="sidebar-inner px-4 pt-3">
        <div className="mb-3 text-start">
          <NavLink to="/panel/dashboard" className="navbar-brand text-white">
            <Image src="/landing/img/logo/logo.svg" className="img-fluid" />
          </NavLink>
        </div>
        <div className="mb-2">
          {routeGroups.id && (
            <div className="sidebar-heading text-white-50 text-uppercase fw-semibold small mb-2">
              {t(routeGroups.id)}
            </div>
          )}
          
          {routeGroups.children?.map((route) => renderNested(route))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
