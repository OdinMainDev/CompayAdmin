import UnifiedFormBuilder from '@/features/form-builder/form-react-adapter/UnifiedFormBuilder';
import { MerchantUpdateRequest } from '@/app/api/merchant/types';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { FormSection } from '@/features/form-builder/form-core/domain/field/FormSection';
import { MerchantService } from '@/app/api/merchant/service';
import { TextField } from '@/features/form-builder/form-core/domain/field/TextField';
import { ApiError } from '@/features/api-client/types/core';
import { Merchant } from '@/app/entities/merchant';
import { useNavigate, useParams } from 'react-router-dom';
import { TabField } from '@/features/form-builder/form-core/domain/field/TabField';
import {
  MultiSelectField,
  NumberField,
  SwitchField,
} from '@/features/form-builder/form-core/domain/field';
import { RepeaterField } from '@/features/form-builder/form-core/domain/field/RepeaterField';

const Edit = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [model, setModel] = useState<Merchant>();
  const [formData, setFormData] = useState<MerchantUpdateRequest>({
    id: 0,
    name: '',
    blocked_countries: [],
    allowed_countries: [],
  });

  useEffect(() => {
    if (!id || model) return;
    const getData = async () => {
      const response = await MerchantService.getById(Number(id));
      if (!response.success) {
        navigate('/dashboard');
        return;
      }

      setModel(response.data);
    };
    void getData();
  }, [id, navigate, model]);

  const sections = useMemo<FormSection[]>(
    () => [
      {
        fields: [
          TabField.create('merchants_tab', {
            tabs: [
              {
                name: 'main',
                label: t('tabs.general'),
                elements: [
                  TextField.create('name', t('fields.name'), { ui: { col: 8 } }),
                  SwitchField.create('is_enabled', t('fields.is_enabled'), { ui: { col: 4 } }),
                ],
              },
              {
                name: 'settings',
                label: t('tabs.settings'),
                elements: [
                  MultiSelectField.create('blocked_countries', t('fields.blocked_countries'), {
                    ui: { col: 6 },
                    options: [
                      { value: 'Russia', label: 'Russia' },
                      { value: 'USA', label: 'USA' },
                      { value: 'China', label: 'China' },
                    ],
                  }),
                  MultiSelectField.create('allowed_countries', t('fields.allowed_countries'), {
                    ui: { col: 6 },
                    options: [
                      { value: 'Russia', label: 'Russia' },
                      { value: 'USA', label: 'USA' },
                      { value: 'China', label: 'China' },
                    ],
                  }),
                  TextField.create(
                    'notification_telegram_chat_id',
                    t('fields.notification_telegram_chat_id'),
                    { ui: { col: 12 } },
                  ),
                ],
              },
              {
                name: 'minimum_amounts',
                label: t('tabs.minimum_amounts'),
                elements: [
                  RepeaterField.create('min_repeater', t('tabs.minimum_amounts'), {
                    ui: { col: 12 },
                    elements: [
                      NumberField.create('min_amount', t('fields.min_amount'), { ui: { col: 12 } }),
                      NumberField.create('max_amount', t('fields.min_amount'), { ui: { col: 12 } }),
                    ],
                  }),
                ],
              },
              {
                name: 'fee_amounts',
                label: t('tabs.fee_amounts'),
                elements: [
                  // RepeaterField.create()
                ],
              },
            ],
          }),
        ],
      },
    ],
    [t],
  );

  const handleSubmit = async () => {
    const dataToSend = { ...formData };
    const response = await MerchantService.update(dataToSend);

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
        title={t('merchants_page.edit') + ': ' + model?.name}
        fields={sections}
        setFormData={setFormData}
        formData={formData}
        handleSubmit={handleSubmit}
        submitLabel={t('form.save')}
        fieldErrors={fieldErrors}
      />
    </>
  );
};

export default Edit;
