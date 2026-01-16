import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Button, Image, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import SimpleBar from 'simplebar-react';
import { CSSTransition } from 'react-transition-group';
import ImageLogo from "@/assets/images/logo/logo.svg";
import ProfilePicture from "@/assets/images/dashboard/examples/profile-picture-1.jpg";
import { faChartPie, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

const SideBar = () => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  // const { t } = useTranslation();
  // const location = useLocation();

  // const isActive = (route?: RouteConfig) => {
  //   if (!route?.path) return false;
  //   return location.pathname.startsWith(`/panel/${route.path}`);
  // };

  // const renderNavLink = (route: RouteConfig) => {
  //   if (!route.path) {
  //     return null;
  //   }

  //   const handleNavClick = () => {
  //     if (window.innerWidth < 768) {
  //       onToggle();
  //     }
  //   };

  //   return (
  //     <Nav.Item key={route.id} className={isActive(route) ? 'active' : ''}>
  //       <NavLink
  //         to={`/panel/${route.path}`}
  //         className={({ isActive: active }) =>
  //           `nav-link d-flex align-items-center ${active ? 'active' : ''}`
  //         }
  //         end={!route.children}
  //         onClick={handleNavClick}
  //       >
  //         {route.meta?.icon && (
  //           <span className="sidebar-icon">
  //             <FontAwesomeIcon icon={route.meta.icon} />
  //           </span>
  //         )}
  //         {route.meta && (
  //           <span className="sidebar-text">{t(route.meta.label)}</span>
  //         )}
  //       </NavLink>
  //     </Nav.Item>
  //   );
  // };

  // const renderNested = (route: RouteConfig) => {
  //   const hasChild = route.children && route.children.length > 0;
  //   if (!hasChild) {
  //     return renderNavLink(route);
  //   }

  //   const childActive = route.children?.some((child) => isActive(child)) ?? false;

  //   return (
  //     <Accordion as={Nav.Item} key={route.id} defaultActiveKey={childActive ? route.id : undefined}>
  //       <Accordion.Item eventKey={route.id}>
  //         <Accordion.Button as="div" className="nav-link d-flex justify-content-between align-items-center">
  //           <span className="d-flex align-items-center">
  //             {route.meta && route.meta.icon && (
  //               <span className="sidebar-icon">
  //                 <FontAwesomeIcon icon={route.meta.icon} />
  //               </span>
  //             )}
  //             {route.meta && (
  //               <span className="sidebar-text">{t(route.meta.label)}</span>
  //             )}
  //           </span>
  //         </Accordion.Button>
  //         <Accordion.Body className="multi-level pt-0">
  //           <Nav className="flex-column">{route.children?.map((child) => renderNested(child))}</Nav>
  //         </Accordion.Body>
  //       </Accordion.Item>
  //     </Accordion>
  //   );
  // };
  
    const NavItem = (props: any) => {
      const { title, link, target, icon, image, badgeText, badgeBg = "secondary", badgeColor = "primary" } = props;
      const classNames = badgeText ? "d-flex justify-content-start align-items-center justify-content-between" : "";
      const navItemClassName = link === pathname ? "active" : "";
      // const linkProps = external ? { href: link } : { as: Link, to: link };
  
      return (
        <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
          <Nav.Link  target={target} className={classNames}>
            <span>
              {icon ? <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span> : null}
              {image ? <Image src={image} width={20} height={20} className="sidebar-icon svg-icon" /> : null}
  
              <span className="sidebar-text">{title}</span>
            </span>
            {badgeText ? (
              <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">{badgeText}</Badge>
            ) : null}
          </Nav.Link>
        </Nav.Item>
      );
    };

  return (
    <>
      <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none">
        <Navbar.Brand className="me-lg-5" as={Link} to={'/'}>
          <Image src={ImageLogo} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse}>
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}>
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  <Image src={ProfilePicture} className="card-img-top rounded-circle border-white" />
                </div>
                <div className="d-block">
                  <h6>Hi, Jane</h6>
                  <Button variant="secondary" size="sm" className="text-dark">
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Sign Out
                  </Button>
                </div>
              </div>
              <Nav.Link className="collapse-close d-md-none" onClick={onCollapse}>
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0">
              <NavLink to="/panel/dashboard" className="navbar-brand text-white">
                <Image src={ImageLogo} className="img-fluid" />
              </NavLink>
              <NavItem title="Overview" link={'/'} icon={faChartPie} />
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};

export default SideBar;
