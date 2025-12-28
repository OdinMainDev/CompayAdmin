import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-bootstrap';
import PageHeader from '../../components/common/PageHeader';
import { useTranslation } from 'react-i18next';
import UnifiedFormBuilder from '../../features/form-platform/packages/form-react-adapter/UnifiedFormBuilder';
import type { RawFormSection } from '../../features/form-platform/packages/form-core/domain/field/RawFormSection';
import FiltersButtonTest from './Modal';
import { buildDefaultValues } from '../../features/form-platform/packages/form-core/domain/utils/default';


const FormBuilderDemoV2 = () => {
  const { t } = useTranslation();

  const sections = useMemo<RawFormSection[]>(() => [
    {
      title: t('form_builder_demo.sections.main.title'),
      description: t('form_builder_demo.sections.main.description'),
      fields: [
        {
          name: 'settings_tabs',
          label: 'Настройки',
          type: 'tabs',
          tabs: [
            {
              name: 'main',
              label: 'Основные данные',
              elements: [
                { name: 'name', label: t('form_builder_demo.fields.name'), type: 'text', required: true },
                { name: 'slug', label: t('form_builder_demo.fields.slug'), type: 'text', helperText: t('form_builder_demo.fields.slug_hint') },
                { name: 'limit', label: t('form_builder_demo.fields.limit'), type: 'number', col: 6, defaultValue: 0 },
                { name: 'password', label: t('form_builder_demo.fields.password'), type: 'password', col: 6 },
                { name: 'description', label: t('form_builder_demo.fields.description'), type: 'textarea', helperText: t('form_builder_demo.fields.description_hint') },
                {
                name: 'repeater_test',
                label: 'Тестовый Repeater',
                type: 'repeater',
                elements: [
                    { name: 'item_name', label: 'Название элемента', type: 'text', value: '' },
                    { name: 'item_value', label: 'Значение элемента', type: 'number', value: 0 },
                  ],
                },
              ],
            },
            {
              name: 'display',
              label: 'Настройки отображения',
              elements: [
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
                    { label: '2', value: 2 },
                    { label: '3', value: '3' },
                    { label: '4', value: 5 },
                  ],
                  helperText: t('form_builder_demo.fields.currencies_hint'),
                  col: 6,
                },
                { name: 'dark_mode', label: 'Enable dark mode', type: 'switch', defaultValue: false },
              ],
            },
          ],
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
      <FiltersButtonTest />

    </>
  );
};

export default FormBuilderDemoV2;
