import { Col, Dropdown, Image, ListGroup, Nav, Row, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Profile1 from '@/assets/images/logo/logo_3.svg';
import { useEffect, useState } from 'react';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@/app/api/private/notification/service';
import { Notification as NotificationEntity } from '@/app/entities/notification';

const Notifications = () => {
  const { t } = useTranslation('panel');

  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);

    const response = await NotificationService.getList({
      start: 0,
      length: 5,
      order_column: 'created_at',
      order_direction: 'desc',
    });

    if (response.success) {
      setNotifications(response.data.data);
    }

    setLoading(false);
  };

  const hasUnread = notifications.some((n) => !n.is_read);

  const markAsRead = async (id: number) => {
    await NotificationService.read(id);
    await fetchNotifications();
  };

  const markAllAsRead = async () => {
    await NotificationService.readAll();
    await fetchNotifications();
  };

  const NotificationItem = ({ n }: { n: NotificationEntity }) => {
    const readClassName = n.is_read ? '' : 'text-danger';

    return (
      <ListGroup.Item action className="border-bottom border-light">
        <Row className="align-items-center">
          <Col className="col-auto">
            <Image src={Profile1} className="user-avatar lg-avatar rounded-circle" />
          </Col>
          <Col className="ps-0 ms--2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 mb-0 text-small">{n.action}</h4>
              </div>
              <div className="text-end">
                <small className={readClassName}>
                  {new Date(n.updated_at * 1000).toLocaleString()}
                </small>
              </div>
            </div>
            <p className="font-small mt-1 mb-0">{n.text}</p>

            {!n.is_read && (
              <button
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={() => markAsRead(n.id)}
              >
                {t('topbar.notifications.mark_read')}
              </button>
            )}
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  return (
    <Dropdown as={Nav.Item}>
      <Dropdown.Toggle as={Nav.Link} className="text-dark icon-notifications me-lg-3">
        <span className="icon icon-sm">
          <FontAwesomeIcon icon={faBell} className="bell-shake" />
          {hasUnread && <span className="icon-badge rounded-circle unread-notifications" />}
        </span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-center mt-2 py-0">
        <ListGroup className="list-group-flush">
          <Nav.Link
            href="#"
            className="text-center text-primary fw-bold border-bottom border-light py-3"
          >
            {t('topbar.notifications.title')}
          </Nav.Link>

          {loading && (
            <div className="text-center py-4">
              <Spinner size="sm" />
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="text-center text-muted py-4">{t('topbar.notifications.empty')}</div>
          )}

          {!loading && notifications.map((n) => <NotificationItem key={n.id} n={n} />)}

          {!loading && notifications.length > 0 && (
            <Dropdown.Item
              className="text-center text-primary fw-bold py-3"
              onClick={markAllAsRead}
            >
              {t('topbar.notifications.read_all')}
            </Dropdown.Item>
          )}
        </ListGroup>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Notifications;
