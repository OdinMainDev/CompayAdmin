import UnifiedFormBuilder from '@/features/form-builder/form-react-adapter/UnifiedFormBuilder';
import { UserUpdateRequest } from '@/app/api/user/types';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { FormSection } from '@/features/form-builder/form-core/domain/field/FormSection';
import { UserService } from '@/app/api/user/service';
import { TextField } from '@/features/form-builder/form-core/domain/field/TextField';
import { ApiError } from '@/features/api-client/types/core';
import { User } from '@/app/entities/user';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

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
    if (!id || model) return;
    const getData = async () => {
      const response = await UserService.getById(Number(id));
      if (!response.success) {
        navigate('/dashboard');
        return;
      }

      setModel(response.data);
      setFormData({
        id: response.data.id,
      });
    };
    void getData();
  }, [id, model, navigate]);

  const sections = useMemo<FormSection[]>(
    () => [
      {
        fields: [
          TextField.create('new_username', t('fields.new_username'), { ui: { col: 6 } }),
          TextField.create('new_password', t('fields.new_password'), { ui: { col: 6 } }),
        ],
      },
    ],
    [t],
  );

  const handleSubmit = async () => {
    const dataToSend = { ...formData };
    const response = await UserService.update(dataToSend);

    if ('success' in response && response.success) {
      setModel(response.data);
    } else {
      const errorResponse = response as ApiError;
      if (errorResponse.errors) setFieldErrors(errorResponse.errors);
    }
  };

  return (
    <>
      <UnifiedFormBuilder
        title={t('users_page.edit') + ': ' + model?.username}
        fields={sections}
        setFormData={setFormData}
        formData={formData}
        handleSubmit={handleSubmit}
        submitLabel={t('form.save')}
        fieldErrors={fieldErrors}
        leftSlot={<Alert variant="info">side bar</Alert>}
      />
    </>
  );
};

export default Edit;
