import React, { useCallback, useMemo, useState } from 'react';
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

const List = () => {
  const { t, i18n } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const refreshTable = useCallback(() => {
    setRefreshKey(prev => prev + 1); 
  }, []);
  
  const locale = i18n.language === 'ru' ? 'ru-RU' : 'en-US';

  const columns = useMemo<DatatableColumn<User>[]>(() => [
    {
      id: 'id',
      field: 'id',
      label: 'ID',
      sortable: true,
    },
    {
      id: 'username',
      field: 'username',
      label: t('datatable_demo.columns.username'),
      sortable: true,
    },
    {
      id: 'is_banned',
      field: 'is_banned',
      label: t('datatable_demo.columns.status'),
      sortable: true,
      render: (user: User) => {
        const status = user.is_banned ? 'blocked' : 'active';
        return (
          <span
            className={`badge bg-${status === 'active' ? 'success' : 'danger'}`}
          >
            {t(`datatable_demo.status.${status}`)}
          </span>
        );
      },
    },
    {
      id: 'is_twofa_enabled',
      field: 'is_twofa_enabled',
      label: '2FA',
      sortable: false,
      render: (user: User) => (
        <span className={`badge bg-${user.is_twofa_enabled ? 'success' : 'secondary'}`}>
          {user.is_twofa_enabled ? t('datatable_demo.status.enabled') : t('datatable_demo.status.disabled')}
        </span>
      ),
    },
    {
      id: 'merchant_id',
      field: 'merchant_id',
      label: 'Merchant ID',
      sortable: true,
      visible: false,
    },
    {
      id: 'created_at',
      field: 'created_at',
      label: t('datatable_demo.columns.created_at'),
      sortable: true,
      render: (user: User) => formatTimestampWithTime(user.created_at, locale),
    },
    {
      id: 'updated_at',
      field: 'updated_at',
      label: t('datatable_demo.columns.updated_at'),
      sortable: true,
      visible: false,
      render: (user: User) => formatTimestampWithTime(user.updated_at, locale),
    },
  ], [t, locale]);

  const config = useMemo<DatatableConfig<User>>(() => ({
    filtersSource:  UserService.getFilters,
    dataSource:     UserService.getList,
    columns,
    quickActions: [
      buildAddAction(t('datatable_demo.actions.add_merchant'), 'panel/user-create', navigate)
    ],
    rowActions: [
      buildEditAction(t('datatable_demo.actions.edit'), '/panel/admin/user-edit/', navigate),
      buildDeleteAction(t('datatable_demo.actions.delete'), UserService.delete, refreshTable)
    ]
  }), [columns, t]);
  return (
    <Datatable
      key={refreshKey}
      config={config}
      className="border-0"
    />
  );
};

export default List;