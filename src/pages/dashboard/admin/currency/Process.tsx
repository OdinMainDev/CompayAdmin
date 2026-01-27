import UnifiedFormBuilder from '@/features/form-builder/form-react-adapter/UnifiedFormBuilder';
import { CurrencyProcessRequest } from '@/app/api/currency/types';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { FormSection } from '@/features/form-builder/form-core/domain/field/FormSection';
import { CurrencyService } from '@/app/api/currency/service';
import { TextField } from '@/features/form-builder/form-core/domain/field/TextField';
import { Currency } from '@/app/entities/currency';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiService } from '@/app/api/api/service';
import { MultiSelectField, NumberField, SelectField, SwitchField } from '@/features/form-builder/form-core/domain/field';
import { SelectOption } from '@/features/form-builder/form-core/domain/extra/SelectFieldExtra';

const Process = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [model, setModel] = useState<Currency>();
  const [formData, setFormData] = useState<CurrencyProcessRequest>();
  const [networks, setNetworks] = useState<SelectOption[]>();

  useEffect(() => {
    const getNetworks = async () => {
      if (networks) {
        return;
      }
      const response = await ApiService.getCurrencyNetworks();
      if (!response.success) {
        return;
      }
      
      const options: SelectOption[] = response.data.map((network) => ({
        value: network,
        label: network,
      }));

      setNetworks(options);
    };
    void getNetworks();
  }, []);

  useEffect(() => {
    if (!id || id == "0") return;
    const getData = async () => {
      const response = await CurrencyService.getById(Number(id));
      if (!response.success) {
        navigate('/dashboard');
        return;
      }

      setModel(response.data);
      setFormData({
        id: response.data.id,
        code_alpha: response.data.code_alpha,
        title: response.data.title,
        network: response.data.network,
        is_coin: response.data.is_coin,
        minor_units: response.data.minor_units,
      });
    };
    void getData();
  }, [id]);

  const sections = useMemo<FormSection[]>(() => [
    {
      fields: [
        TextField.create('title', t('fields.name'), { ui: { col: 8 }}),
        NumberField.create('code_alpha', t('fields.code_alpha'), { ui: { col: 4, } }),
        SelectField.create(
          'network', 
          t('fields.network'), 
          { 
            options: networks,
            ui: { col: 6, } 
          }
        ),
        TextField.create('minor_units', t('fields.minor_units'), { ui: { col: 4, } }),
        SwitchField.create('is_coin', t('fields.is_coin'), { ui: { col: 'auto' } }),
      ],
    },
  ], [t, networks]);

  const handleSubmit = async () => {
    // const dataToSend = { ...formData };
    // // const response = await CurrencyService.process(dataToSend);
   
    // if ('success' in response && response.success) {
    //     setModel(response.data)
    // }
    // else {
    //   const errorResponse = response as ApiError;
    //   if (errorResponse.errors)
    //     setFieldErrors(errorResponse.errors);
    // }
  }

  return (
    <>
      <UnifiedFormBuilder 
        title={id && id != "0" ? t('currencies_page.edit') + ": " + model?.code_alpha : t('currencies_page.create')}
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

export default Process;