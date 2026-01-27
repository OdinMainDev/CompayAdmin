import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ApiError } from '@/features/api-client/types/core';
import UnifiedFormBuilder from '@/features/form-builder/form-react-adapter/UnifiedFormBuilder';
import { FormSection } from '@/features/form-builder/form-core/domain/field/FormSection';
import { TabField } from '@/features/form-builder/form-core/domain/field/TabField';
import { TextField } from '@/features/form-builder/form-core/domain/field/TextField';
import { PasswordField } from '@/features/form-builder/form-core/domain/field/PasswordField';
import { SwitchField } from '@/features/form-builder/form-core/domain/field/SwitchField';
import { MerchantField } from '@/app/datatable/custom/fields/MerchantField';
import { UserService } from '@/app/api/user/service';
import { UserCreateRequest } from '@/app/api/user/types';

const Create = () => {
  const { t } = useTranslation();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const navigate = useNavigate();

  const sections = useMemo<FormSection[]>(() => [
    {
      fields: [
        TabField.create('users_tab', {
          tabs: [
            {
              name: 'main',
              label: t('tabs.edit'),
              elements: [
                TextField.create('username', t('form_builder_demo.fields.username'), { required: true, col: 6 }),
                PasswordField.create('password', t('form_builder_demo.fields.user_password'), { required: true, col: 6 }),
              ],
            },
            {
              name: 'display',
              label: 'Настройки отображения',
              elements: [
                SwitchField.create('is_admin', t('form_builder_demo.fields.is_admin')),
                MerchantField.create('merchant_id', t('form_builder_demo.fields.merchant')),
              ],
            },
          ],
        }),
      ],
    },
  ], [t]);
  

  const [formData, setFormData] = useState<UserCreateRequest>({
    username: '',
    password: '',
    is_admin: false,
    merchant_id: undefined,
  });

  const handleSubmit = async () => {
    const dataToSend = { ...formData };

    const response = await UserService.create(dataToSend);
    if ('success' in response && response.success) {
        navigate(`/dashboard/users/edit/${response.data.id}`);
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
        title={t('users_page.create')}
        fields={sections}
        setFormData={setFormData}
        formData={formData}
        handleSubmit={handleSubmit}
        submitLabel={t('form.create')}
        fieldErrors={fieldErrors}
      />
    </>
  );
};

export default Create;