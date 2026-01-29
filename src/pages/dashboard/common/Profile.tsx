import UnifiedFormBuilder from '@/features/form-builder/form-react-adapter/UnifiedFormBuilder';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { FormSection } from '@/features/form-builder/form-core/domain/field/FormSection';
import { TextField } from '@/features/form-builder/form-core/domain/field/TextField';
import { ApiError } from '@/features/api-client/types/core';
import { useAuthContext } from '@/features/auth/auth-context';
import { ProfileRequest } from '@/app/api/profile/types';
import { User } from '@/app/entities/user';
import ProfileSidebar from '@/components/dashboard/custom/sidebars/ProfileSidebar';
import { ProfileService } from '@/app/api/profile/service';
import { TabField } from '@/features/form-builder/form-core/domain/field/TabField';

const Profile = () => {
  const { t } = useTranslation();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const { user } = useAuthContext();
  const [model, setModel] = useState<User>();
  const [formData, setFormData] = useState<ProfileRequest>({
    old_username: '',
    new_username: '',
    old_password: '',
    new_password: '',
  });

  useEffect(() => {
    if (!user) return;
    const setData = () => {
      setModel(user);
    };
    void setData();
  }, [user]);

  const sections = useMemo<FormSection[]>(
    () => [
      {
        fields: [
          TabField.create('profile_tabs', {
            tabs: [
              {
                name: 'username_change',
                label: t('tabs.username_change'),
                elements: [
                  TextField.create('old_username', t('fields.old_username'), { ui: { col: 6 } }),
                  TextField.create('new_username', t('fields.new_username'), { ui: { col: 6 } }),
                ],
              },
              {
                name: 'password_change',
                label: t('tabs.password_change'),
                elements: [
                  TextField.create('old_password', t('fields.old_password'), { ui: { col: 6 } }),
                  TextField.create('new_password', t('fields.new_password'), { ui: { col: 6 } }),
                ],
              },
            ],
          }),
        ],
      },
    ],
    [t],
  );

  const handleSubmit = async () => {
    const dataToSend = { ...formData };
    const response = await ProfileService.update(dataToSend);

    if (!response.success) {
      const errorResponse = response as ApiError;
      if (errorResponse.errors) setFieldErrors(errorResponse.errors);
    }
  };

  return (
    <>
      <UnifiedFormBuilder
        title={t('profile_page.title')}
        fields={sections}
        setFormData={setFormData}
        formData={formData}
        handleSubmit={handleSubmit}
        submitLabel={t('form.save')}
        fieldErrors={fieldErrors}
        leftSlot={<ProfileSidebar user={model} />}
      />
    </>
  );
};

export default Profile;
