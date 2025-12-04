import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-bootstrap';
import PageHeader from '../../components/common/PageHeader';
import { FormBuilder } from '../../features/FormBuilder';
import { FormSection } from '../../features/FormBuilder/entities';
import { buildDefaultValues } from '../../features/FormBuilder/formFunctions';

const FormBuilderDemo = () => {
  const sections = useMemo<FormSection[]>(
    () => [
      {
        title: 'Основное',
        description: 'Минимальный набор полей: текст, числа, пароли и textarea.',
        fields: [
          { name: 'name', label: 'Название', type: 'text', required: true },
          { name: 'slug', label: 'Слаг', type: 'text', helperText: 'URL-часть для API' },
          { name: 'limit', label: 'Лимит', type: 'number', col: 6, defaultValue: 0 },
          { name: 'password', label: 'Пароль секции', type: 'password', col: 6 },
          {
            name: 'description',
            label: 'Описание',
            type: 'textarea',
            helperText: 'Краткое описание оффера или кампании.',
          },
        ],
      },
      {
        title: 'Настройки отображения',
        description: 'Загрузка обложки и базовые селекты/мультиселекты.',
        fields: [
          { name: 'cover', label: 'Обложка', type: 'image', helperText: 'JPG/PNG до 2MB' },
          {
            name: 'category',
            label: 'Категория',
            type: 'select',
            options: [
              { label: 'Казино', value: 'casino' },
              { label: 'Спорт', value: 'sport' },
              { label: 'Платежи', value: 'payments' },
            ],
            required: true,
            col: 6,
          },
          {
            name: 'currencies',
            label: 'Доступные валюты',
            type: 'multiselect',
            options: [
              { label: 'USDT', value: 'USDT' },
              { label: 'BTC', value: 'BTC' },
              { label: 'ETH', value: 'ETH' },
              { label: 'EUR', value: 'EUR' },
            ],
            helperText: 'Можно выбрать несколько значений',
            col: 6,
          },
        ],
      },
    ],
    [],
  );

  const [formData, setFormData] = useState<Record<string, any>>({});
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
        title="Form Builder"
        subtitle="Облегчённые поля: ввод, мультиселекты и загрузка фото под новый UI."
        trail={[{ label: 'Инструменты' }, { label: 'Form Builder' }]}
      />
      {saved && <Alert variant="success">Форма сохранена (mock).</Alert>}
      <FormBuilder
        sections={sections}
        setFormData={setFormData}
        formData={formData}
        handleSubmit={handleSubmit}
        title="Карточка мерчанта"
        subTitle="Используются только основные элементы: фото, инпуты, мультиселекты."
        submitLabel="Сохранить"
      />
    </>
  );
};

export default FormBuilderDemo;
