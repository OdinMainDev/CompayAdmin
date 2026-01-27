import { Container, Nav, Navbar } from 'react-bootstrap';
import FastAction from './FastActions';
import Notifications from './Notifications';
import Profile from './Profile';

const TopBar = () => {
  return (
    <Navbar expanded className="top-bar">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <FastAction />
          <Nav className="align-items-center">
            <Notifications />
            <Profile />
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};

export default TopBar;
