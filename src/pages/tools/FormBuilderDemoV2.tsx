import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-bootstrap';
import PageHeader from '../../components/common/PageHeader';
import { FormBuilder } from '../../features/FormBuilder';
import { buildDefaultValues } from '../../features/FormBuilder/formFunctions';
import { useTranslation } from 'react-i18next';
import UnifiedFormBuilder from '../../features/FormBuilder/UnifiedFormBuilder';
import type { FormSection } from '../../features/form-platform/packages/form-core/domain/field/FormSection';
import type { RawFormSection } from '../../features/form-platform/packages/form-core/domain/field/RawFormSection';


const FormBuilderDemoV2 = () => {
  const { t } = useTranslation();
  const sections = useMemo<RawFormSection[]>(() => [
    {
      title: t('form_builder_demo.sections.main.title'),
      description: t('form_builder_demo.sections.main.description'),
      fields: [
        {
          type: 'tab',
          name: 'main_tab',
          label: 'Основные данные',
          extra: {
            title: 'Main Tab',
            repeater_items: [
              { name: 'name', label: t('form_builder_demo.fields.name'), type: 'text', required: true },
              {
                name: 'slug',
                label: t('form_builder_demo.fields.slug'),
                type: 'text',
                helperText: t('form_builder_demo.fields.slug_hint'),
              },
              { name: 'limit', label: t('form_builder_demo.fields.limit'), type: 'number', col: 6, defaultValue: 0 },
              { name: 'password', label: t('form_builder_demo.fields.password'), type: 'password', col: 6 },
              {
                name: 'description',
                label: t('form_builder_demo.fields.description'),
                type: 'textarea',
                helperText: t('form_builder_demo.fields.description_hint'),
              },
            ],
          },
        },
      ],
    },
    {
      title: t('form_builder_demo.sections.display.title'),
      description: t('form_builder_demo.sections.display.description'),
      fields: [
        {
          type: 'tab',
          name: 'display_tab',
          label: 'Display settings',
          extra: {
            title: 'Display Tab',
            repeater_items: [
              { name: 'cover', label: t('form_builder_demo.fields.cover'), type: 'image', helperText: t('form_builder_demo.fields.cover_hint') },
              {
                name: 'category',
                label: t('form_builder_demo.fields.category'),
                type: 'select',
                options: [
                  { label: t('form_builder_demo.options.casino'), value: 'casino' },
                  { label: t('form_builder_demo.options.sport'), value: 'sport' },
                  { label: t('form_builder_demo.options.payments'), value: 'payments' },
                ],
                required: true,
                col: 6,
              },
              {
                name: 'category-number',
                label: t('form_builder_demo.fields.category'),
                type: 'select-number',
                options: [
                  { label: '1', value: 1 },
                  { label: 2, value: '2' },
                  { label: 3, value: 3 },
                ],
                required: true,
                col: 6,
              },
              {
                name: 'currencies',
                label: t('form_builder_demo.fields.currencies'),
                type: 'multiselect',
                options: [
                  { label: 'USDT', value: 'USDT' },
                  { label: 'BTC', value: 'BTC' },
                  { label: 'ETH', value: 'ETH' },
                  { label: 'EUR', value: 'EUR' },
                ],
                helperText: t('form_builder_demo.fields.currencies_hint'),
                col: 6,
              },
              {
                name: 'currencies-number',
                label: 'multiselect-number',
                type: 'multiselect-number',
                options: [
                  { label: '1', value: '1' },
                  { label: 2, value: 2 },
                  { label: 3, value: '3' },
                  { label: '4', value: 5 },
                ],
                helperText: t('form_builder_demo.fields.currencies_hint'),
                col: 6,
              },
              { name: 'notifications', label: 'Enable notifications', type: 'switch', defaultValue: true, required: true },
              { name: 'newsletter', label: 'Subscribe to newsletter', type: 'switch', defaultValue: false },
              { name: 'dark_mode', label: 'Enable dark mode', type: 'switch', defaultValue: false },
              { name: 'beta_features', label: 'Enable beta features', type: 'switch', defaultValue: true },
            ],
          },
        },
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
      <PageHeader
        title={t('form_builder_demo.page.title')}
        subtitle={t('form_builder_demo.page.subtitle')}
        trail={[{ label: t('form_builder_demo.page.tools') }, { label: t('form_builder_demo.page.form_builder') }]}
      />
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

export default FormBuilderDemoV2;
