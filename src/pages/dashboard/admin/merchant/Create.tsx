import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ApiError } from '@/features/api-client/types/core';
import UnifiedFormBuilder from '@/features/form-builder/form-react-adapter/UnifiedFormBuilder';
import { FormSection } from '@/features/form-builder/form-core/domain/field/FormSection';
import { TextField } from '@/features/form-builder/form-core/domain/field/TextField';
import { PasswordField } from '@/features/form-builder/form-core/domain/field/PasswordField';
import { MerchantService } from '@/app/api/merchant/service';
import { MerchantCreateRequest } from '@/app/api/merchant/types';
import MerchantCreateAdminData from '@/components/dashboard/custom/forms_components/MerchantCreateAdminData';

const Create = () => {
  const { t } = useTranslation();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const navigate = useNavigate();

  const sections = useMemo<FormSection[]>(
    () => [
      {
        fields: [
          TextField.create('name', t('fields.name'), { ui: { col: 12 } }),
          TextField.create('admin_username', t('fields.admin_username'), {
            ui: { col: 6 },
            beforeField: <MerchantCreateAdminData />,
          }),
          PasswordField.create('admin_password', t('fields.admin_password'), { ui: { col: 6 } }),
        ],
      },
    ],
    [t],
  );

  const [formData, setFormData] = useState<MerchantCreateRequest>({
    name: '',
    admin_username: '',
    admin_password: '',
  });

  const handleSubmit = async () => {
    const dataToSend = { ...formData };

    const response = await MerchantService.create(dataToSend);
    if ('success' in response && response.success) {
      navigate(`/dashboard/merchants/edit/${response.data.id}`);
    } else {
      const errorResponse = response as ApiError;
      if (errorResponse.errors) setFieldErrors(errorResponse.errors);
    }
  };

  return (
    <>
      <UnifiedFormBuilder
        title={t('merchants_page.create')}
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
