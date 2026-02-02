import UnifiedFormBuilder from '@/features/form-builder/form-react-adapter/UnifiedFormBuilder';
import { MerchantUpdateRequest } from '@/app/api/private/merchant/types';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { FormSection } from '@/features/form-builder/form-core/domain/field/FormSection';
import { MerchantService } from '@/app/api/private/merchant/service';
import { TextField } from '@/features/form-builder/form-core/domain/field/TextField';
import { ApiError } from '@/features/api-client/types/core';
import { Merchant } from '@/app/entities/merchant';
import { useNavigate, useParams } from 'react-router-dom';
import { TabField } from '@/features/form-builder/form-core/domain/field/TabField';
import {
  MultiSelectField,
  NumberField,
  SelectField,
} from '@/features/form-builder/form-core/domain/field';
import { RepeaterField } from '@/features/form-builder/form-core/domain/field/RepeaterField';
import { ApiService } from '@/app/api/public/api/service';
import { SelectOption } from '@/features/form-builder/form-core/domain/extra/SelectFieldExtra';
import { stringArrToSelectOptions } from '@/app/forms/transforms/options';
import { CurrencyField } from '@/app/forms/fields/CurrencyField';
import MerchantUpdateWebPageSettings from '@/components/dashboard/custom/forms_components/MerchantUpdateWebPageSettings';
import { ApiAdminService } from '@/app/api/private/api/service';

const Edit = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [model, setModel] = useState<Merchant>();
  const [countries, setCountries] = useState<SelectOption[]>([]);
  const [feeTypes, setFeeTypes] = useState<SelectOption[]>([]);
  const [formData, setFormData] = useState<MerchantUpdateRequest>();

  useEffect(() => {
    if (!id || model) return;
    const getData = async () => {
      const response = await MerchantService.getById(Number(id));
      if (!response.success) {
        navigate('/dashboard');
        return;
      }

      setModel(response.data);
      setFormData({
        id: response.data.id,
        name: response.data.name,
        blocked_countries: response.data.settings.conditions.blocked_countries,
        allowed_countries: response.data.settings.conditions.allowed_countries,
        notification_telegram_chat_id:
        response.data.settings.public_settings.notification_telegram_chat_id,
        minimum_amounts: response.data.settings.minimum_amounts,
        minimum_confirmations: response.data.settings.minimum_confirmations,
        fee_amounts: response.data.settings.fee_amounts,
        fee_percent_amounts: response.data.settings.fee_percent_amounts,
      });
    };
    void getData();
  }, [id, navigate, model]);

  useEffect(() => {
    const getCountries = async () => {
      const response = await ApiService.getCountries();
      if (!response.success) {
        return;
      }
      setCountries(stringArrToSelectOptions(response.data));
    };
    const getFeeTypes = async () => {
      const response = await ApiAdminService.getFeeTypes();
      if (!response.success) {
        return;
      }
      setFeeTypes(stringArrToSelectOptions(response.data));
    };
    void getCountries();
    void getFeeTypes();
  }, []);

  const sections = useMemo<FormSection[]>(
    () => [
      {
        fields: [
          TabField.create('merchants_tab', {
            tabs: [
              {
                name: 'main',
                label: t('tabs.general'),
                elements: [TextField.create('name', t('fields.name'), { 
                  ui: { col: 12 },
                })],
              },
              {
                name: 'settings_merchant',
                label: t('tabs.settings_merchant'),
                elements: [
                  MultiSelectField.create('blocked_countries', t('fields.blocked_countries'), {
                    ui: { col: 6 },
                    options: countries,
                    beforeField: <MerchantUpdateWebPageSettings />,
                  }),
                  MultiSelectField.create('allowed_countries', t('fields.allowed_countries'), {
                    ui: { col: 6 },
                    options: countries,
                  }),
                  TextField.create(
                    'notification_telegram_chat_id',
                    t('fields.notification_telegram_chat_id'),
                    { ui: { col: 12 } },
                  ),
                ],
              },
              {
                name: 'settings_currencies',
                label: t('tabs.settings_currencies'),
                elements: [
                  RepeaterField.create('minimum_amounts', t('fields.minimum_amounts'), {
                    ui: { col: 6 },
                    elements: [
                      CurrencyField.create('currency', t('fields.currency'), {
                        ui: { col: 6 },
                      }),
                      NumberField.create('amount', t('fields.amount'), { ui: { col: 6 } }),
                    ],
                  }),
                  RepeaterField.create('minimum_confirmations', t('fields.minimum_confirmations'), {
                    ui: { col: 6 },
                    elements: [
                      CurrencyField.create('currency', t('fields.currency'), {
                        ui: { col: 6 },
                      }),
                      NumberField.create('count', t('fields.count'), { ui: { col: 6 } }),
                    ],
                  }),
                ],
              },
              {
                name: 'settings_fees',
                label: t('tabs.settings_fees'),
                elements: [
                  RepeaterField.create('fee_amounts', t('fields.fee_amounts'), {
                    ui: { col: 6 },
                    elements: [
                      CurrencyField.create('currency', t('fields.currency'), {
                        ui: { col: 4 },
                      }),
                      SelectField.create('fee_type', t('fields.fee_type'), {
                        options: feeTypes,
                        ui: { col: 4 },
                      }),
                      NumberField.create('amount', t('fields.amount'), { ui: { col: 4 } }),
                    ],
                  }),
                  RepeaterField.create('fee_percent_amounts', t('fields.fee_percent_amounts'), {
                    ui: { col: 6 },
                    elements: [
                      CurrencyField.create('currency', t('fields.currency'), {
                        ui: { col: 4 },
                      }),
                      SelectField.create('fee_type', t('fields.fee_type'), {
                        options: feeTypes,
                        ui: { col: 4 },
                      }),
                      NumberField.create('amount', t('fields.amount'), { ui: { col: 4 } }),
                    ],
                  }),
                ],
              },
            ],
          }),
        ],
      },
    ],
    [countries, feeTypes],
  );

  const handleSubmit = async () => {
    if (!formData) return;
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
    <UnifiedFormBuilder
      title={t('merchants_page.edit') + ': ' + model?.name}
      fields={sections}
      setFormData={setFormData}
      setFieldErrors={setFieldErrors}
      formData={formData}
      handleSubmit={handleSubmit}
      submitLabel={t('form.save')}
      fieldErrors={fieldErrors}
    />
  );
};

export default Edit;
