import { Button, Card } from 'react-bootstrap';
import { User } from '@/app/entities/user';
import { useTranslation } from 'react-i18next';
import { UserService } from '@/app/api/private/user/service';
import { Dispatch, SetStateAction } from 'react';

interface UserActionProps {
  user: User;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

export default function UserSidebarAction({ user, setUser }: UserActionProps) {
  const { t } = useTranslation();

  const disable2FA = async (): Promise<void> => {
    const response = await UserService.disable2FA(user.id);
    if (response.success) {
      setUser(response.data);
    }
  };

  const banUser = async (): Promise<void> => {
    const response = await UserService.ban(user.id);
    if (response.success) {
      setUser(response.data);
    }
  };

  const unbanUser = async (): Promise<void> => {
    const response = await UserService.unban(user.id);
    if (response.success) {
      setUser(response.data);
    }
  };

  return (
    <Card className="shadow-sm mb-3">
      <Card.Body>
        <h6 className="mb-3">{t('sidebars.user.actions')}</h6>
        <div className="d-grid gap-2">
          <Button variant={'warning'} onClick={() => void disable2FA()}>
            {t('sidebars.user.disable_2fa')}
          </Button>
          <Button
            variant={user.is_banned ? 'secondary' : 'danger'}
            onClick={() => {
              let action = banUser;
              if (user.is_banned) {
                action = unbanUser;
              }
              void action();
            }}
          >
            {user.is_banned ? t('sidebars.user.set_unbanned') : t('sidebars.user.set_banned')}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
