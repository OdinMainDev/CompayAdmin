import { useState } from 'react';
import logo from '@/assets/images/landing/logo/logo.svg';
import { Button, Container, Form, InputGroup, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';

export const Header = () => {
  const [showMobile, setShowMobile] = useState(false);

  const handleClose = () => setShowMobile(false);
  const handleShow = () => setShowMobile(true);

  return (
    <header id="home">
      <div id="sticky-header" className="tg-header__area transparent-header">
        <Container>
          <Navbar expand="lg" className="tgmenu__nav">
            <Navbar.Brand href="index.html" className="logo">
              <img src={logo} alt="Logo" />
            </Navbar.Brand>
            <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-lg-flex">
              <Nav as="ul" className="navigation">
                <Nav.Item as="li">
                  <Nav.Link href="#home" className="section-link">
                    Home
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link href="#features" className="section-link">
                    features
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link href="#token" className="section-link">
                    token
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link href="#work" className="section-link">
                    how it works
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link href="#roadmap" className="section-link">
                    roadmap
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            <div className="tgmenu__action">
              <Nav as="ul" className="list-wrap">
                <Nav.Item as="li" className="header-btn">
                  <Button href="#!" className="tg-btn">
                    buy now
                  </Button>
                </Nav.Item>
              </Nav>
            </div>
            <Button
              variant="link"
              className="mobile-nav-toggler d-lg-none p-0"
              onClick={handleShow}
              aria-label="Open menu"
            >
              <i className="tg-flaticon-menu-1"></i>
            </Button>
          </Navbar>
        </Container>
      </div>

      <Offcanvas show={showMobile} onHide={handleClose} className="tgmobile__menu" placement="end">
        <Offcanvas.Body className="p-0">
          <nav className="tgmobile__menu-box">
            <div className="close-btn">
              <Button variant="link" className="p-0" onClick={handleClose} aria-label="Close menu">
                <i className="tg-flaticon-close-1"></i>
              </Button>
            </div>
            <div className="nav-logo">
              <a href="index.html">
                <img src={logo} alt="Logo" />
              </a>
            </div>
            <div className="tgmobile__search">
              <Form action="#">
                <InputGroup>
                  <Form.Control type="text" placeholder="Search here..." />
                  <Button type="submit" aria-label="Search">
                    <i className="fas fa-search"></i>
                  </Button>
                </InputGroup>
              </Form>
            </div>
            <div className="tgmobile__menu-outer">
              <Nav as="ul" className="navigation">
                <Nav.Item as="li">
                  <Nav.Link href="#home" className="section-link">
                    Home
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link href="#features" className="section-link">
                    features
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link href="#token" className="section-link">
                    token
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link href="#work" className="section-link">
                    how it works
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link href="#roadmap" className="section-link">
                    roadmap
                  </Nav.Link>
                </Nav.Item>
                <NavDropdown title="blog" id="landing-blog-dropdown-mobile" className="menu-item-has-children">
                  <NavDropdown.Item href="blog.html">Our Blog</NavDropdown.Item>
                  <NavDropdown.Item href="blog-details.html">Blog Details</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </div>
            <div className="social-links">
              <Nav as="ul" className="list-wrap">
                <Nav.Item as="li">
                  <Nav.Link href="#">
                    <i className="fab fa-facebook-f"></i>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link href="#">
                    <i className="fab fa-twitter"></i>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link href="#">
                    <i className="fab fa-instagram"></i>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link href="#">
                    <i className="fab fa-youtube"></i>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </nav>
        </Offcanvas.Body>
      </Offcanvas>
    </header>
  );
};
