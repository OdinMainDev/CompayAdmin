

import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import UnifiedFormBuilder from '../../features/form-platform/packages/form-react-adapter/UnifiedFormBuilder';
import type { RawFormSection } from '../../features/form-platform/packages/form-core/domain/field/RawFormSection';
import { buildDefaultValues } from '../../features/form-platform/packages/form-core/domain/utils/default';
import { useUsers } from '../../app/api/hooks/useUsers'; 
import type { UserCreateRequest } from '../../app/api/types/user';



const UserCreate = () => {
  const { t } = useTranslation();
  const { createUser, searchMerchants, merchants } = useUsers();

  const merchantOptions = merchants.map(m => ({
    label: m.name,
    value: m.id,
  }));

  const sections = useMemo<RawFormSection[]>(() => [
    {
      title: t('form_builder_demo.sections.main.title'),
      description: t('form_builder_demo.sections.main.description'),
      fields: [
        { name: 'username', label: t('form_builder_demo.fields.username'), type: 'text', required: true },
        { name: 'password', label: t('form_builder_demo.fields.user_password'), type: 'password', required: true },
        { name: 'is_admin', label: t('form_builder_demo.fields.is_admin'), type: 'switch', defaultValue: false },
        { 
          name: 'merchant_id', 
          label: t('form_builder_demo.fields.merchant'), 
          type: 'select', 
          options: merchantOptions, 
          helperText: t('form_builder_demo.fields.merchant_hint') 
        },
      ],
    },
  ], [t]);
  
  useEffect(() => {
    searchMerchants("2"); 
  }, []);
  
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(buildDefaultValues(sections));
  }, [sections]);

  const handleSubmit = async () => {
    const success = await createUser(formData as unknown as UserCreateRequest);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <>
      {saved && <Alert variant="success">{t('form_builder_demo.alert_saved')}</Alert>}
      <UnifiedFormBuilder 
        json={sections}
        setFormData={setFormData}
        formData={formData}
        handleSubmit={handleSubmit}
        title={t('form_builder_demo.form.title')}
        subTitle={t('form_builder_demo.form.subtitle')}
        submitLabel={t('form_builder_demo.form.submit')}
      />
    </>
  );
};

export default UserCreate;
