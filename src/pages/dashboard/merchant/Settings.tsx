import UnifiedFormBuilder from '@/features/form-builder/form-react-adapter/UnifiedFormBuilder';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { FormSection } from '@/features/form-builder/form-core/domain/field/FormSection';
import { TextField } from '@/features/form-builder/form-core/domain/field/TextField';
import { ApiError } from '@/features/api-client/types/core';
import { useNavigate } from 'react-router-dom';
import { MerchantService } from '@/app/api/public/merchant/service';
import { MerchantUpdateRequest } from '@/app/api/public/merchant/types';
import MerchantPublicSettings from '@/components/dashboard/custom/sidebars/MerchantPublicSettings';

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState<MerchantUpdateRequest>({
    notification_telegram_chat_id: 0,
  });

  useEffect(() => {
    const getData = async () => {
      const response = await MerchantService.get();
      if (!response.success) {
        navigate('/dashboard');
        return;
      }

      setFormData({
        notification_telegram_chat_id: response.data.settings.notification_telegram_chat_id,
      });
    };
    void getData();
  }, [navigate]);

  const sections = useMemo<FormSection[]>(
    () => [
      {
        fields: [
          TextField.create(
            'notification_telegram_chat_id',
            t('fields.notification_telegram_chat_id'),
            { ui: { col: 12 } },
          ),
        ],
      },
    ],
    [t],
  );

  const handleSubmit = async () => {
    const dataToSend = { ...formData };
    const response = await MerchantService.update(dataToSend);

    if (!response.success) {
      const errorResponse = response as ApiError;
      if (errorResponse.errors) setFieldErrors(errorResponse.errors);
    }
  };

  return (
    <>
      <UnifiedFormBuilder
        title={t('merchants_page.settings')}
        fields={sections}
        setFormData={setFormData}
        formData={formData}
        handleSubmit={handleSubmit}
        submitLabel={t('form.save')}
        fieldErrors={fieldErrors}
        leftSlot={<MerchantPublicSettings />}
      />
    </>
  );
};

export default Settings;
