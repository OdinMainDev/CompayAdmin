import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Image, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useRef, useState } from 'react';
import SimpleBar from 'simplebar-react';
import { CSSTransition } from 'react-transition-group';
import ImageLogo from "@/assets/images/logo/logo.svg";
import ProfilePicture from "@/assets/images/dashboard/examples/profile-picture-1.jpg";
import { faChartPie, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import NavItem from './NavItem';



const SideBar = () => {
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  // const routes = useRouteGroups();
 
  // if (!routes) {
  //   return null;
  // }

  const onCollapse = () => setShow(!show);

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
                  <h6>Hi, Jane</h6>
                  <Button
                    as={"button"}
                    variant="secondary"
                    size="sm"
                    className="text-dark"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Sign Out
                  </Button>
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

              <NavItem setShow={setShow} title="Overview" link={'/'} icon={faChartPie} isHiddenDesktop/>
              
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};

export default SideBar;
