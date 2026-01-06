

import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import UnifiedFormBuilder from '../../features/form-platform/packages/form-react-adapter/UnifiedFormBuilder';
import type { RawFormSection } from '../../features/form-platform/packages/form-core/domain/field/RawFormSection';
import { buildDefaultValues } from '../../features/form-platform/packages/form-core/domain/utils/default';


const UserCreate = () => {
  const { t } = useTranslation();

  const sections = useMemo<RawFormSection[]>(() => [
    {
      title: t('form_builder_demo.sections.main.title'),
      description: t('form_builder_demo.sections.main.description'),
      fields: [
        { name: 'name', label: t('form_builder_demo.fields.name'), type: 'text', required: true },
        { name: 'slug', label: t('form_builder_demo.fields.slug'), type: 'text', helperText: t('form_builder_demo.fields.slug_hint') },
        { name: 'limit', label: t('form_builder_demo.fields.limit'), type: 'number', col: 6, defaultValue: 0 },
        { name: 'password', label: t('form_builder_demo.fields.password'), type: 'password', col: 6 },
        { name: 'description', label: t('form_builder_demo.fields.description'), type: 'textarea', helperText: t('form_builder_demo.fields.description_hint') },
      ],
    },
  ], [t]);
  
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(buildDefaultValues(sections));
  }, [sections]);

  const handleSubmit = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

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
