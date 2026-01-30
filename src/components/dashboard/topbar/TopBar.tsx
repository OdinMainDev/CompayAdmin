import { Container, Nav, Navbar } from 'react-bootstrap';
import FastAction from '@/components/dashboard/custom/topbar/FastActions';
import Notifications from './Notifications';
import Profile from './Profile';
import { useAuthContext } from '@/features/auth/auth-context';

const TopBar = () => {
  const { role } = useAuthContext();
  return (
    <Navbar expanded className="top-bar">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          {role == 'admin' ? <FastAction /> : <div></div>}
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
