import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Image, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { ReactNode, useRef, useState } from 'react';
import SimpleBar from 'simplebar-react';
import { CSSTransition } from 'react-transition-group';
import ImageLogo from "@/assets/images/logo/logo.svg";
import ProfilePicture from "@/assets/images/dashboard/examples/profile-picture-1.jpg";
import { faChartPie, faRocket, faSignOut, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import NavItem from './NavItem';
import { useGetAvailMenuRoutes } from '@/features/router/hooks/useGetAvailMenuRoutes';
import { RouteConfig } from '@/features/router/types';
import { useTranslation } from 'react-i18next';



const SideBar = () => {
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const routes = useGetAvailMenuRoutes();
  const { t } = useTranslation("menu");
 
  if (!routes) {
    return null;
  }

  const onCollapse = () => setShow(!show);

  const renderNavLink = (route: RouteConfig, nextPath: string): ReactNode => {
   const hasChildren = Boolean(route.children?.length);

    if (!hasChildren) {
      if (!route.meta?.label || !route.meta.icon) {
        return;
      }
      return (
        <NavItem
        
          key={route.id}
          setShow={setShow}
          title={route.meta?.label ?? ''}
          link={nextPath + "/" + route.path}
          icon={route.meta.icon}
        />
      );
    }

    if(route.path != ""){
      nextPath = nextPath + "/" + route.path;
    }
    return route.children!.map(child => renderNavLink(child, nextPath));
  };

  return (
    <>
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        className="navbar-theme-primary px-4 d-md-none"
      >
        <Navbar.Brand as={Link} to={'/'}>
          <Image src={ImageLogo} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle as={Button} onClick={onCollapse}>
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>

      <CSSTransition timeout={300} in={show} classNames="sidebar-transition" nodeRef={sidebarRef}>
        <SimpleBar
          className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}
        >
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  <Image
                    src={ProfilePicture}
                    className="card-img-top rounded-circle border-white"
                  />
                </div>
                <div>
                  <h6>{`{USERNAME}`}</h6>
                  <Link to={'/dashboard/logout'}>
                    <Button
                      as={"button"}
                      variant="secondary"
                      size="sm"
                      className="text-dark"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                      {t("logout")}
                    </Button>
                  </Link>
                </div>
              </div>
              <Nav.Link className="collapse-close" onClick={onCollapse}>
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>

            <Nav className="flex-column pt-3 pt-md-0">
              <NavLink to="/dashboard" className="navbar-brand nav-link text-white text-start hidden-nav-mobile">
                <Image src={ImageLogo} className="img-fluid" />
              </NavLink>

              <NavItem setShow={setShow} title="dashboard" link={'/dashboard'} icon={faRocket} isHiddenDesktop/>

              {routes.children?.map((route) => renderNavLink(route, ""))}
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};

export default SideBar;
