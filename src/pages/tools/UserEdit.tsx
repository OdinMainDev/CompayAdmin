import { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import UnifiedFormBuilder from '../../features/form-platform/packages/form-react-adapter/UnifiedFormBuilder';
import type { RawFormSection } from '../../features/form-platform/packages/form-core/domain/field/RawFormSection';
import { useUsers } from '../../app/api/hooks/useUsers';
import type { UserUpdateRequest } from '../../app/api/types/user';

const UserEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedUser, searchMerchants, fetchUser, updateUser, merchants, getFieldErrors } = useUsers();
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    searchMerchants("2"); 
  }, []);

  useEffect(() => {
    if (!id) return;
    fetchUser(Number(id));
  }, [id, fetchUser]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username,
        password: '', 
        is_admin: selectedUser.is_admin,
        merchant_id: selectedUser.merchant_id ?? undefined,
      });
    }
  }, [selectedUser]);

  const sections = useMemo<RawFormSection[]>(() => [
    {
      title: t('form_builder_demo.edit_user'),
      description: t('form_builder_demo.desc'),
      fields: [
        { name: 'username', label: t('form_builder_demo.fields.username'), type: 'text', required: true },
        { name: 'password', label: t('form_builder_demo.fields.user_password'), type: 'password' },
        { name: 'is_admin', label: t('form_builder_demo.fields.is_admin'), type: 'switch', defaultValue: false },
        { 
          name: 'merchant_id', 
          label: t('form_builder_demo.fields.merchant'), 
          type: 'select', 
          options: merchants.map(m => ({ label: m.name, value: m.id })),
        }
      ],
    },
  ], [t, merchants]);

  const handleSubmit = useCallback(async () => {
    if (!id) return;

    const dataToSend: UserUpdateRequest = {
      id: Number(id),
      username: formData.username as string,
      password: formData.password ? (formData.password as string) : undefined,
      ...(formData.is_admin ? { merchant_id: 0 } : { merchant_id: formData.merchant_id as number }),
      is_banned: formData.is_banned as boolean | undefined,
      do_disable_twofa: formData.do_disable_twofa as boolean | undefined,
    };

    const success = await updateUser(dataToSend);
    if (success) {
      navigate(`/panel/admin/datatable`);
    }
  }, [formData, updateUser, id, navigate]);

  if (!selectedUser) return <div>{t('loading')}</div>;

  return (
    <UnifiedFormBuilder
      json={sections}
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      title={t('form_builder_demo.form.title')}
      subTitle={t('form_builder_demo.form.subtitle')}
      submitLabel={t('form_builder_demo.form.submit')}
      fieldErrors={getFieldErrors()}
    />
  );
};

export default UserEdit;
