import UnifiedFormBuilder from '@/features/form-builder/form-react-adapter/UnifiedFormBuilder';
import { UserUpdateRequest } from '@/app/api/user/types';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { FormSection } from '@/features/form-builder/form-core/domain/field/FormSection';
import { UserService } from '@/app/api/user/service';
import { TextField } from '@/features/form-builder/form-core/domain/field/TextField';
import { PasswordField } from '@/features/form-builder/form-core/domain/field/PasswordField';
import { ApiError } from '@/features/api-client/types/core';
import { User } from '@/app/entities/user';
import { useNavigate, useParams } from 'react-router-dom';
import { TabField } from '@/features/form-builder/form-core/domain/field/TabField';

const Edit = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [model, setModel] = useState<User>();
  const [formData, setFormData] = useState<UserUpdateRequest>({
    id: 0,
    username: '',
    password: '',
  });

  useEffect(() => {
    if (!id) return;
    const getData = async () => {
      const response = await UserService.getById(Number(id));
      if (!response.success) {
        navigate('/dashboard')
        return;
      }

      setModel(response.data);
      setFormData({
        id: response.data.id,
      });
    };
    void getData();
  }, [id]);

  const sections = useMemo<FormSection[]>(() => [
    {
      fields: [
        TabField.create('users_tab', {
          tabs: [
            {
              name: 'main',
              label: t('tabs.personal_data'),
              elements: [
                TextField.create('new_username', t('fields.new_username'), { col: 12, }),
                PasswordField.create('new_password', t('fields.new_password'), { col: 12 }),
              ],
            },
          ],
        }),
      ],
    },
  ], [t]);

  const handleSubmit = async () => {
    const dataToSend = { ...formData };
    const response = await UserService.update(dataToSend);
   
    if ('success' in response && response.success) {
        setModel(response.data)
    }
    else {
      const errorResponse = response as ApiError;
      if (errorResponse.errors)
        setFieldErrors(errorResponse.errors);
    }
  }

  return (
    <>
      <UnifiedFormBuilder 
        title={t('users_page.edit') + " " + model?.username}
        fields={sections}
        setFormData={setFormData}
        formData={formData}
        handleSubmit={handleSubmit}
        submitLabel={t('form.save')}
        fieldErrors={fieldErrors}
      />
    </>
  );
};

export default Edit;