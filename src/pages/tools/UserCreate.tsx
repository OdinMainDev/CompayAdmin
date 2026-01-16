

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UnifiedFormBuilder from '../../features/form-platform/packages/form-react-adapter/UnifiedFormBuilder';
import type { RawFormSection } from '../../features/form-platform/packages/form-core/domain/field/RawFormSection';
import { buildDefaultValues } from '../../features/form-platform/packages/form-core/domain/utils/default';
import { useUsers } from '../../app/api/users/hooks/useUsers'; 
import type { UserCreateRequest } from '../../app/api/users/types';


const UserCreate = () => {
  const { t } = useTranslation();
  const { createUser, searchMerchants, getFieldErrors, merchants } = useUsers();

  
  useEffect(() => {
    searchMerchants("2"); 
  }, []);

  
  const sections = useMemo<RawFormSection[]>(() => [
    {
      title: t('form_builder_demo.create_user'),
      description: t('form_builder_demo.desc'),
      fields: [
        { name: 'username', label: t('form_builder_demo.fields.username'), type: 'text', required: true },
        { name: 'password', label: t('form_builder_demo.fields.user_password'), type: 'password', required: true },
        { name: 'is_admin', label: t('form_builder_demo.fields.is_admin'), type: 'switch', defaultValue: false },
        { 
          name: 'merchant_id', 
          label: t('form_builder_demo.fields.merchant'), 
          type: 'select', 
          options: merchants.map(m => ({ label: m.name, value: m.id })),
        },
      ],
    },
  ], [t, merchants]); 
  
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    setFormData(buildDefaultValues(sections));
  }, [sections]);

  const handleSubmit = async () => {
    const dataToSend = { ...formData };

    if (dataToSend.is_admin) {
      dataToSend.merchant_id = 0;
    }

    const success = await createUser(dataToSend as unknown as UserCreateRequest);
    if (success) {

    }
  }

  return (
    <>
      <UnifiedFormBuilder 
        json={sections}
        setFormData={setFormData}
        formData={formData}
        handleSubmit={handleSubmit}
        title={t('form_builder_demo.form.title')}
        subTitle={t('form_builder_demo.form.subtitle')}
        submitLabel={t('form_builder_demo.form.submit')}
        fieldErrors={getFieldErrors()} 
      />
    </>
  );
};

export default UserCreate;
