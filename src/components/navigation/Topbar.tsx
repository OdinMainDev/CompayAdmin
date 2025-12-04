import { ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Button, Dropdown, Form, Image, Navbar } from 'react-bootstrap';
import { UserRole, useAuth } from '../../auth/AuthContext';
import Avatar from '../../assets/volt/team/profile-picture-1.jpg';

interface TopbarProps {
  onToggleSidebar: () => void;
}

const Topbar = ({ onToggleSidebar }: TopbarProps) => {
  const { role, switchRole, logout } = useAuth();

  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    switchRole(event.target.value as UserRole);
  };

  return (
    <Navbar expand="lg" className="navbar navbar-dark navbar-theme-primary px-3 mb-4">
      <div className="d-flex align-items-center">
        <Button
          variant="link"
          className="text-white d-md-none sidebar-toggle me-2 p-0"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <Navbar.Brand className="mb-0 text-white fw-semibold">Merchant Console</Navbar.Brand>
      </div>
      <div className="ms-auto d-flex align-items-center gap-3">
        <Form.Select
          size="sm"
          value={role}
          onChange={handleRoleChange}
          className="w-auto bg-white text-dark"
          aria-label="Select role"
        >
          <option value="admin">Admin</option>
          <option value="dev">Dev</option>
        </Form.Select>
        <Dropdown align="end">
          <Dropdown.Toggle variant="link" className="p-0 text-decoration-none">
            <Image src={Avatar} roundedCircle height={38} width={38} />
          </Dropdown.Toggle>
          <Dropdown.Menu className="mt-2">
            <Dropdown.Header>
              <div className="small text-muted">Signed in as</div>
              <div className="fw-semibold text-dark text-capitalize">{role}</div>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item onClick={logout}>
              <FontAwesomeIcon icon={faRightFromBracket} className="me-2" />
              Выйти
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default Topbar;
