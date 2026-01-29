import { Card, Spinner } from 'react-bootstrap';
import { User } from '@/app/entities/user';
import UserSidebarAction from './UserSidebarAction';
import { useTranslation } from 'react-i18next';
import { formatTimestampWithTime } from '@/features/datatable-core';
import { Dispatch, SetStateAction } from 'react';

interface UserSidebarProps {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  withActions?: boolean;
}

export default function UserSidebar({ user, setUser, withActions = false }: UserSidebarProps) {
  const { t } = useTranslation();

  if (!user) {
    return (
      <Card className="h-100 shadow-sm">
        <Card.Body className="d-flex align-items-center justify-content-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">{t('loading')}...</span>
          </Spinner>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-sm mb-3">
        <Card.Body>
          <h5 className="mb-4">
            {t('sidebars.user.title')} (Id: {user.id})
          </h5>

          <div className="position-relative mb-4">
            <hr className="bg-body-secondary" />
            <div className="divider-content-center">{t('sidebars.user.details')}</div>
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">{t('sidebars.user.has_ban')}:</span>
              {user.is_banned ? '✅' : '❌'}
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">2FA:</span>
              {user.is_twofa_enabled ? '✅' : '❌'}
            </div>
          </div>

          <div className="mb-3">
            <div className="mb-3">
              <small className="text-muted d-block mb-1">{t('sidebars.user.merchant')}</small>
              <span className="fw-medium">{user.merchant_id}</span>
            </div>
            <div className="mb-3">
              <small className="text-muted d-block mb-1">{t('sidebars.user.creator')}</small>
              <span className="fw-medium">{user.creator_id}</span>
            </div>
            <div className="mb-3">
              <small className="text-muted d-block mb-1">{t('sidebars.user.created_at')}</small>
              <span className="fw-medium">{formatTimestampWithTime(user.created_at)}</span>
            </div>
            <div className="mb-3">
              <small className="text-muted d-block mb-1">{t('sidebars.user.updated_at')}</small>
              <span className="fw-medium">{formatTimestampWithTime(user.updated_at)}</span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {withActions && <UserSidebarAction user={user} setUser={setUser} />}
    </>
  );
}
