import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faServer, faShieldHalved, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Card, Col, ProgressBar, Row } from 'react-bootstrap';
import { useAuth } from '../../auth/AuthContext';
import PageHeader from '../../components/common/PageHeader';

const DashboardOverview = () => {
  const { role } = useAuth();

  const stats = [
    { label: 'Активные пользователи', value: '1 204', trend: '+12%', icon: faUsers },
    { label: 'Загруженность сервисов', value: '72%', trend: 'Стабильно', icon: faServer },
    { label: 'Конверсия', value: '4.7%', trend: '+0.4%', icon: faChartLine },
    { label: 'Безопасность', value: 'Высокая', trend: '2FA включена', icon: faShieldHalved },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`Быстрый взгляд на метрики для ${role === 'dev' ? 'dev-среды' : 'admin-панели'}.`}
        trail={[{ label: 'Главная' }, { label: 'Dashboard' }]}
      />
      <Row className="g-3">
        {stats.map((item) => (
          <Col xs={12} md={6} xl={3} key={item.label}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <div className="text-muted small">{item.label}</div>
                    <h4 className="mb-0 text-dark">{item.value}</h4>
                  </div>
                  <span className="icon-shape icon-shape-primary rounded-circle text-white">
                    <FontAwesomeIcon icon={item.icon} />
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between text-muted small">
                  <span>За 7 дней</span>
                  <span className="text-success fw-semibold">{item.trend}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3 mt-1">
        <Col xl={7}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h5 className="mb-1">Состояние интеграций</h5>
                  <div className="text-muted small">
                    Быстрый прогресс основных потоков (платежи, мерчант, уведомления).
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Платёжный шлюз</span>
                  <span>82%</span>
                </div>
                <ProgressBar now={82} variant="success" className="bg-soft" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Уведомления</span>
                  <span>64%</span>
                </div>
                <ProgressBar now={64} variant="primary" className="bg-soft" />
              </div>
              <div className="mb-1">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Верификация</span>
                  <span>45%</span>
                </div>
                <ProgressBar now={45} variant="warning" className="bg-soft" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={5}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h5 className="mb-1">Сводка ролей</h5>
                  <div className="text-muted small">Доступ к веткам маршрутов dev/admin.</div>
                </div>
                <span className="badge bg-secondary text-dark text-uppercase fw-semibold">
                  {role}
                </span>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                  <span>Dev маршруты</span>
                  <span className="text-success fw-semibold">/panel/dev/*</span>
                </li>
                <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                  <span>Admin маршруты</span>
                  <span className="text-primary fw-semibold">/panel/admin/*</span>
                </li>
                <li className="list-group-item px-0 text-muted small">
                  Переключение роли в шапке меняет набор страниц и меню, повторяя схему предыдущей
                  версии.
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardOverview;
