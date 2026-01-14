import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Datatable, type DatatableColumn, type DatatableConfig } from '../../features/datatable-core';
import PageHeader from '../../components/common/PageHeader';
import type { RawFormSection } from '../../features/form-platform/packages/form-core/domain/field/RawFormSection';
import { getUserListFilters, type GetUserListFiltersResponse, type UserRecord } from '../../app/api/user/get_list';
import type { ApiDatatableQuery } from '../../features/datatable-core/domain/entities/DatatableQuery';
import { postRequest, type ApiError } from '../../app/api/request';
import type { IResponseList } from '../../features/datatable-core/domain/entities/DatatableResponse';
import { formatTimestampWithTime } from '../../features/datatable-core/utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../app/api/hooks/useUsers';



const DatatableDemoV2 = () => {
  const { t, i18n } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0); 
  const navigate = useNavigate();

  const {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    deleteUser,
    clearError,
  } = useUsers();

  const refreshTable = useCallback(() => {
    setRefreshKey(prev => prev + 1); 
  }, []);
  

  const [backendFilters, setBackendFilters] = useState<RawFormSection[]>([]);


  const loadFilters = useCallback(async () => {
    try {
      const response = await getUserListFilters();
      
      if ('success' in response && response.success === false) {
        console.error('Failed to load filters:', response);
        return;
      }
      
      const backendFiltersData = response as GetUserListFiltersResponse;
      const transformFilterType = (type: string): string => {
        switch (type.toLowerCase()) {
          case 'integer':
          case 'number':
          case 'float':
          case 'decimal':
          case 'merchant_id':
            return 'number';
          case 'string':
          case 'text':
          case 'varchar':
            return 'text';
          case 'boolean':
          case 'bool':
            return 'select';
          case 'list':
            return 'select';
          case 'date':
          case 'datetime':
          case 'timestamp':
            return 'date-range';
          case 'select':
          case 'dropdown':
          case 'enum':
            return 'select';
          case 'multiselect':
            return 'multiselect';
          case 'range':
          case 'slider':
            return 'range';
          default:
            return 'text';
        }
      };
      
      const formSections: RawFormSection[] = [
        {
          title: '',
          fields: backendFiltersData.data.map(filter => {

            const lowerType = filter.type.toLowerCase();

            const baseField = {
              name: filter.name,
              label: t(filter.name), 
              placeholder: t(filter.name), 
              type: transformFilterType(filter.type)
            };
            
            if (lowerType == 'bool' || lowerType == 'boolean') {
              const options = [
                {
                  label: t("yes"),
                  value: true,
                },
                {
                  label: t("no"),
                  value: false,
                },
              ];

              return {
                ...baseField,
                options: options
              };
            }

            if ((lowerType === 'list' || lowerType === 'select' || 
                 lowerType === 'dropdown' || lowerType === 'enum' ||
                 lowerType === 'multiselect') && 
                filter.values && Array.isArray(filter.values)) {
              
              const options = filter.values.map(value => ({
                label: String(value),
                value: value
              }));
              
              return {
                ...baseField,
                options: options
              };
            }
            
            return baseField;
          })
        }
      ];
      
      setBackendFilters(formSections);
      
    } catch (error) {
      console.error('Error loading filters:', error);
    } 
  }, [t]); 

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);   

  const locale = i18n.language === 'ru' ? 'ru-RU' : 'en-US';
  const columns = useMemo<DatatableColumn<UserRecord>[]>(() => [
    {
      id: 'id',
      field: 'id',
      label: 'ID',
      sortable: true,
      filterable: true,
      visible: true,
      width: 80,
      align: 'center',
      filter: {
        type: 'number',
      }
    },
    {
      id: 'username',
      field: 'username',
      label: t('datatable_demo.columns.username'),
      sortable: true,
      filterable: true,
      visible: true,
      minWidth: 200,
      render: (value: unknown, _: UserRecord) => (
        <span className="text-truncate" title={String(value)}>
          {String(value)}
        </span>
      ),
      filter: {
        type: 'text'
      }
    },
    {
      id: 'is_banned',
      field: 'is_banned',
      label: t('datatable_demo.columns.status'),
      sortable: true,
      filterable: true,
      visible: true,
      width: 120,
      render: (value: unknown, _: UserRecord) => {
        const isBanned = Boolean(value);
        const status = isBanned ? 'blocked' : 'active';
        return (
          <span
            className={`badge bg-${status === 'active' ? 'success' : 'danger'}`}
          >
            {t(`datatable_demo.status.${status}`)}
          </span>
        );
      },
      filter: {
        type: 'select',
        options: [
          { label: t('datatable_demo.status.active'), value: false },
          { label: t('datatable_demo.status.blocked'), value: true }
        ],
      }
    },
    {
      id: 'is_twofa_enabled',
      field: 'is_twofa_enabled',
      label: '2FA',
      sortable: false,
      filterable: true,
      visible: true,
      width: 80,
      align: 'center',
      render: (value: unknown, _: UserRecord) => (
        <span className={`badge bg-${value ? 'success' : 'secondary'}`}>
          {value ? t('datatable_demo.status.enabled') : t('datatable_demo.status.disabled')}
        </span>
      ),
      filter: {
        type: 'select',
        options: [
          { label: t('datatable_demo.status.enabled'), value: true },
          { label: t('datatable_demo.status.disabled'), value: false }
        ],
      }
    },
    {
      id: 'merchant_id',
      field: 'merchant_id',
      label: 'Merchant ID',
      sortable: true,
      filterable: true,
      visible: false,
      width: 120,
      align: 'center',
      render: (value: unknown, _: UserRecord) => (
        <span>{String(value)}</span>
      ),
      filter: {
        type: 'number',
      }
    },
    {
      id: 'created_at',
      field: 'created_at',
      label: t('datatable_demo.columns.created_at'),
      sortable: true,
      filterable: true,
      visible: true,
      width: 120,
      render: (value: unknown, _: UserRecord) => formatTimestampWithTime(value, locale),
    },
    {
      id: 'updated_at',
      field: 'updated_at',
      label: t('datatable_demo.columns.updated_at'),
      sortable: true,
      filterable: true,
      visible: false,
      width: 150,
      render: (value: unknown, _: UserRecord) => formatTimestampWithTime(value, locale),
      filter: {
        type: 'date',
      }
    },
  ], [t, locale]);

  const config = useMemo<DatatableConfig<UserRecord>>(() => ({
    id: 'users-table',
    dataSource: async (query: ApiDatatableQuery) => {

      const filtersObject = query.type_filters.reduce((acc, filter) => {
        if (typeof filter.value === "object" && filter.value !== null && "from" in filter.value && "to" in filter.value) {
          acc[`${filter.field}_from`] = filter.value.from;
          acc[`${filter.field}_to`] = filter.value.to;
        } else {
          acc[filter.field] = filter.value;
        }
        return acc;
      }, {} as Record<string, unknown>);

      try {
        const response = await postRequest<IResponseList<UserRecord> | ApiError>(
          '/api/panel/admin/dev/users/list',
          {
            isAuth: true,
            body: {
              length: query.length,
              start: query.start,
              order_column: query.order_column,
              order_direction: query.order_direction,
              filters: filtersObject
            }
          }
        );
        
        if ('success' in response && response.success === false) {
          const errorResponse: IResponseList<UserRecord> = {
            success: false,
            data: {
              data: [], 
              recordsCount: 0,
              recordsFiltered: 0,
              recordsTotal: 0
            }
          };
          return errorResponse;
        }
        
        return response as IResponseList<UserRecord>;
        
      } catch (error) {
        const errorResponse: IResponseList<UserRecord> = {
          success: false,
          data: {
            data: [],
            recordsCount: 0,
            recordsFiltered: 0,
            recordsTotal: 0
          }
        };
        return errorResponse;
      }
    },
    columns,
    filterForm: backendFilters,
    title: t('datatable_demo.table.title'),
    subtitle: t('datatable_demo.table.subtitle'),
    pagination: {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [5, 10, 25, 50],
      position: 'both'
    },
    sorting: {
      enabled: true,
      multiColumn: false,
      defaultSort: { column: 'id', direction: 'asc' }
    },
    filtering: {
      enabled: true,
      mode: 'modal',
      quickFilters: [
        {
          id: 'active-only',
          label: t('datatable_demo.filters.active_only'),
          filters: [{ field: 'status', value: 'active' }]
        },
        {
          id: 'high-turnover',
          label: t('datatable_demo.filters.high_turnover'),
          filters: [{ field: 'turnover', value: 100000 }]
        }
      ]
    },
    export: {
      enabled: true,
      formats: ['csv', 'excel'],
      columns: ['id'],
      handler: async (_: ApiDatatableQuery, format: 'csv' | 'excel', ) => {
        console.log('export', format);
      }
    },
    ui: {
      density: 'normal',
      striped: true,
      bordered: true,
      hoverable: true,
      stickyHeader: true,
      resizableColumns: false,
      columnVisibility: true
    },
    events: {
      onRowClick: (row: UserRecord, _: React.MouseEvent) => {
        console.log('Row clicked:', row);
      },
      onRowDoubleClick: (row: UserRecord, _: React.MouseEvent) => {
        console.log('Row double clicked:', row);
      },
      onSelectionChange: (selected: UserRecord[]) => {
        console.log('Selection changed:', selected.length);
      },
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
      {
        id: 'refresh',
        label: t('datatable_demo.actions.refresh'),
        icon: <i className="fas fa-sync"></i>,
        variant: 'secondary',
        handler: () => {
          console.log('Refresh clicked');
        }
      },
    ],
    rowActions: [
      {
        id: 'edit',
        label: t('datatable_demo.actions.edit'),
        icon: <i className="fas fa-edit"></i>,
        variant: 'primary',
        position: 'row',
        handler: (params: { currentRow?: UserRecord }) => {
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
        position: 'row',
        confirm: {
          title: t('datatable_demo.confirm.delete_title'),
          message: t('datatable_demo.confirm.delete_message'),
          confirmText: t('datatable_demo.confirm.delete_confirm'),
          cancelText: t('datatable_demo.confirm.delete_cancel')
        },
        handler: async ({ currentRow }: { currentRow?: UserRecord }) => {
          if (!currentRow?.id) return;
          
          const confirmed = window.confirm(
            `${t('datatable_demo.confirm.delete_title')}\n${t('datatable_demo.confirm.delete_message')}`
          );
          
          if (!confirmed) return;
          
          try {
            const response = await postRequest<{ success: boolean }>(
              '/api/panel/admin/dev/users/delete',
              {
                isAuth: true,
                body: { id: currentRow.id }
              }
            );
            
            if (response.success) {
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
  }), [columns, backendFilters, t]);

  return (
    <>
      <PageHeader
        title={t('datatable_demo.page.title')}
        subtitle={t('datatable_demo.page.subtitle')}
        trail={[
          { label: t('datatable_demo.page.tools') }, 
          { label: t('datatable_demo.page.datatable') }
        ]}
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

export default DatatableDemoV2;