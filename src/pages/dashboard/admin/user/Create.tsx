import UnifiedFormBuilder from '@/features/form-builder/form-react-adapter/UnifiedFormBuilder';
import { UserCreateRequest } from '@/app/api/user/types';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { FormSection } from '@/features/form-builder/form-core/domain/field/FormSection';
import { UserService } from '@/app/api/user/service';
import { TabField } from '@/features/form-builder/form-core/domain/field/TabField';
import { TextField } from '@/features/form-builder/form-core/domain/field/TextField';
import { PasswordField } from '@/features/form-builder/form-core/domain/field/PasswordField';
import { SwitchField } from '@/features/form-builder/form-core/domain/field/SwitchField';
import { MerchantField } from '@/app/datatable/custom/fields/MerchantField';
import { ApiError } from '@/features/api-client/types/core';

const Create = () => {
  const { t } = useTranslation();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const sections = useMemo<FormSection[]>(() => [
    {
      title: t('form_builder_demo.create_user'),
      description: t('form_builder_demo.desc'),
      fields: [
        TabField.create('settings_tabs', 'Настройки', {
          tabs: [
            {
              name: 'main',
              label: 'Основные данные',
              elements: [
                TextField.create('username', t('form_builder_demo.fields.username'), { required: true }),
                PasswordField.create('password', t('form_builder_demo.fields.user_password'), { required: true }),
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
    if (dataToSend.is_admin) {
      dataToSend.merchant_id = 0;
    }

    const response = await UserService.create(dataToSend);
    if ('success' in response && response.success) {
        // navigate(`/dashboard/users/${success}`);
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
        title={t('datatable_demo.page.title')}
        subTitle={t('datatable_demo.page.subtitle')}
        fields={sections}
        setFormData={setFormData}
        formData={formData}
        handleSubmit={handleSubmit}
        submitLabel={t('form_builder_demo.form.submit')}
        fieldErrors={fieldErrors}
      />
    </>
  );
};

export default Create;