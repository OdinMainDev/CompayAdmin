import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Datatable, 
  formatTimestampWithTime,
  type DatatableColumn, 
  type DatatableConfig 
} from '@/features/datatable-core';
import { User } from '@/app/entities/user';
import { UserService } from '@/app/api/user/service';
import { buildAddAction } from '@/features/datatable-core/utils/buildAddAction';
import { buildEditAction } from '@/features/datatable-core/utils/buildEditAction';
import { buildDeleteAction } from '@/features/datatable-core/utils/buildDeleteAction';
import PageHeader from '@/components/dashboard/common/PageHeader';
import { buildDefaultValues } from '@/features/form-builder/form-core/domain/utils/default';
import { RawFormSection } from '@/features/form-builder/form-core/domain/field/RawFormSection';
import { Merchant } from '@/app/entities/merchant';
import UnifiedFormBuilder from '@/features/form-builder/form-react-adapter/UnifiedFormBuilder';
import { MerchantService } from '@/app/api/merchant/service';
import { UserCreateRequest } from '@/app/api/user/types';

const Create = () => {
  const { t } = useTranslation();
  const [merchants, setMerchants] = useState<Merchant[]>();
//   const navigate  = useNavigate();

  useEffect(() => {
    const getMerchants = async () => {
      const response = await MerchantService.search("test");
      if (!response.success) {
        return;
      }
      setMerchants(response.data);
    };
    void getMerchants();
  }, [merchants]);

   const sections = useMemo<RawFormSection[]>(() => [
    {
      title: t('form_builder_demo.create_user'),
      description: t('form_builder_demo.desc'),
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
                    { name: 'username', label: t('form_builder_demo.fields.username'), type: 'text', required: true },
                    { name: 'password', label: t('form_builder_demo.fields.user_password'), type: 'password', required: true },
              ],
            },
            {
              name: 'display',
              label: 'Настройки отображения',
              elements: [
                { name: 'is_admin', label: t('form_builder_demo.fields.is_admin'), type: 'switch', defaultValue: false },
                { 
                    name: 'merchant_id', 
                    label: t('form_builder_demo.fields.merchant'),
                    type: 'select', 
                    options: merchants?.map(m => ({ label: m.name, value: m.id })),
                },
              ],
            },
          ],
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

    const success = await UserService.create(dataToSend as unknown as UserCreateRequest);
    if (success) {
        // navigate(`/dashboard/users/${success}`);
    }
  }

  return (
    <>
       <PageHeader
        title={t('datatable_demo.page.title')}
        subtitle={t('datatable_demo.page.subtitle')}
      />
      <UnifiedFormBuilder 
        json={sections}
        setFormData={setFormData}
        formData={formData}
        handleSubmit={handleSubmit}
        submitLabel={t('form_builder_demo.form.submit')}
        // fieldErrors={getFieldErrors()}
      />
    </>
  );
};

export default Create;