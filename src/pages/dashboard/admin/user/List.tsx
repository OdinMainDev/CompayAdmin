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
import PageHeader from '@/components/dashboard/common/PageHeader';
import { UserService } from '@/app/api/user/service';

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
    sorting: {
      enabled: true,
      defaultSort: { column: 'id', direction: 'asc' }
    },
    quickActions: [
      {
        id: 'add',
        label: t('datatable_demo.actions.add_merchant'),
        icon: <i className="fas fa-plus"></i>,
        variant: 'primary',
        handler: () => {
          navigate('panel/user-create');
        }
      },
    ],
    rowActions: [
      {
        id: 'edit',
        label: t('datatable_demo.actions.edit'),
        icon: <i className="fas fa-edit"></i>,
        variant: 'primary',
        handler: (params: { currentRow?: User }) => {
           if (!params.currentRow) return;
           const userId = params.currentRow.id;
           navigate(`/panel/admin/user-edit/${userId}`);
        }
      },
      {
        id: 'delete',
        label: t('datatable_demo.actions.delete'),
        icon: <i className="fas fa-trash"></i>,
        variant: 'danger',
        confirm: {
          title: t('datatable_demo.confirm.delete_title'),
          message: t('datatable_demo.confirm.delete_message'),
          confirmText: t('datatable_demo.confirm.delete_confirm'),
          cancelText: t('datatable_demo.confirm.delete_cancel')
        },
        handler: async ({ currentRow }: { currentRow?: User }) => {
          if (!currentRow?.id) return;
          const confirmed = window.confirm(
            `${t('datatable_demo.confirm.delete_title')}\n${t('datatable_demo.confirm.delete_message')}`
          );
          if (!confirmed) return;
          try {
            const response = await UserService.delete(currentRow.id);

            if ('success' in response && response.success) {
              alert('User deleted successfully');
              refreshTable();
            } else {
              alert('Failed to delete user');
            }
          } catch (error) {
            alert('Error deleting user');
            console.error('Delete error:', error);
          }
        }
      }
    ]
  }), [columns, t]);
  return (
    <>
      <PageHeader
        title={t('datatable_demo.page.title')}
        subtitle={t('datatable_demo.page.subtitle')}
      />
      <div className="card shadow-sm border-0">
        <div  key={`datatable-internal-${refreshKey}`}  className="card-body p-0">
          <Datatable
            config={config}
            className="border-0"
          />
        </div>
      </div>
    </>
  );
};

export default List;