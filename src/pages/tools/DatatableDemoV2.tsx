import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Datatable, type DatatableColumn, type DatatableConfig, type DatatableQuery, type SortState } from '../../features/datatable-core';
import PageHeader from '../../components/common/PageHeader';
import type { BulkActionContext } from '../../features/datatable-core/domain/entities/BulkAction';
import type { RawFormSection } from '../../features/form-platform/packages/form-core/domain/field/RawFormSection';
import { getUserListFilters, type GetUserListFiltersResponse } from '../../app/api/user/get_list';

interface MerchantRecord {
  id: number;
  merchant: string;
  status: 'active' | 'paused' | 'blocked';
  turnover: number;
  currency: string;
  created_at?: string;
  updated_at?: string;
}

const MOCK_DATA: MerchantRecord[] = [
  { id: 101, merchant: 'Acme Crypto', status: 'active', turnover: 182000, currency: 'USDT' },
  { id: 102, merchant: 'Nebula Pay', status: 'paused', turnover: 87000, currency: 'BTC' },
  { id: 103, merchant: 'Northern Lights', status: 'active', turnover: 265000, currency: 'ETH' },
  { id: 104, merchant: 'Simple Cash', status: 'blocked', turnover: 12000, currency: 'USDT' },
  { id: 105, merchant: 'LayerX', status: 'active', turnover: 98000, currency: 'BTC' },
  { id: 106, merchant: 'Mint Labs', status: 'active', turnover: 53000, currency: 'USDT' },
  { id: 107, merchant: 'Vela', status: 'paused', turnover: 21000, currency: 'ETH' },
  { id: 108, merchant: 'Aurora', status: 'active', turnover: 450000, currency: 'USDT' },
];

const DatatableDemoV2 = () => {
  const { t, i18n } = useTranslation();

  const [backendFilters, setBackendFilters] = useState<RawFormSection[]>([]);

  const loadFilters = useCallback(async () => {
    try {
      const response = await getUserListFilters();
      
      if ('success' in response && response.success === false) {
        console.error('Failed to load filters:', response);
        return;
      }
      
      const backendFiltersData = response as GetUserListFiltersResponse;
      
      const formSections: RawFormSection[] = [
        {
          title: '',
          fields: backendFiltersData.data.map(filter => ({
            name: filter.name,
            label: '', 
            placeholder: t(filter.name), 
            type: filter.type == "integer" ? 'number': filter.type == 'string' ? 'text' : filter.type,
          }))
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
  const columns = useMemo<DatatableColumn<MerchantRecord>[]>(() => [
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
        placeholder: 'Filter by ID',
        operator: 'equals'
      }
    },
    {
      id: 'merchant',
      field: 'merchant',
      label: t('datatable_demo.columns.merchant'),
      sortable: true,
      filterable: true,
      visible: true,
      minWidth: 200,
      filter: {
        type: 'text',
        placeholder: 'Search merchant...',
        operator: 'contains'
      }
    },
    {
      id: 'status',
      field: 'status',
      label: t('datatable_demo.columns.status'),
      sortable: true,
      filterable: true,
      visible: true,
      width: 120,
      render: (value, row) => (
        <span
          className={`badge bg-${
            row.status === 'active' ? 'success' 
            : row.status === 'paused' ? 'warning' 
            : 'danger'
          }`}
        >
          {t(`datatable_demo.status.${row.status}`)}
        </span>
      ),
      filter: {
        type: 'select',
        options: [
          { label: t('datatable_demo.status.active'), value: 'active' },
          { label: t('datatable_demo.status.paused'), value: 'paused' },
          { label: t('datatable_demo.status.blocked'), value: 'blocked' }
        ],
        operator: 'equals'
      }
    },
    {
      id: 'turnover',
      field: 'turnover',
      label: t('datatable_demo.columns.turnover'),
      sortable: true,
      filterable: true,
      visible: false,
      align: 'right',
      width: 150,
      render: (value, row) => (
        <span className="text-end">
          {row.turnover.toLocaleString(locale)} {row.currency}
        </span>
      ),
      filter: {
        type: 'number',
        placeholder: 'Min turnover',
        operator: 'greaterThanOrEqual'
      }
    },
    {
      id: 'currency',
      field: 'currency',
      label: t('datatable_demo.columns.currency'),
      sortable: true,
      filterable: true,
      visible: true,
      align: 'center',
      width: 100,
      render: (value: unknown) => {
        const displayValue = value === null || value === undefined 
          ? '' 
          : String(value);
        
        return <span className="badge bg-info">{displayValue}</span>;
      },
      filter: {
        type: 'select',
        options: [
          { label: 'USDT', value: 'USDT' },
          { label: 'BTC', value: 'BTC' },
          { label: 'ETH', value: 'ETH' }
        ],
        operator: 'equals'
      }
    }
  ], [t, locale]);

  const config = useMemo<DatatableConfig<MerchantRecord>>(() => ({
    id: 'merchants-table',
    dataSource: async (query: DatatableQuery) => {
      const { pagination, sort = [], filters = [] } = query;
      
      let filteredData = [...MOCK_DATA];
      
      filters.forEach(filter => {
        const field = filter.field as keyof MerchantRecord;
        
        switch (filter.operator) {
          case 'equals':
            filteredData = filteredData.filter(item => 
              String(item[field]) === String(filter.value)
            );
            break;
          case 'contains':
            filteredData = filteredData.filter(item =>
              String(item[field]).toLowerCase()
                .includes(String(filter.value).toLowerCase())
            );
            break;
          case 'greaterThan':
            filteredData = filteredData.filter(item =>
              Number(item[field]) > Number(filter.value)
            );
            break;
          case 'greaterThanOrEqual':
            filteredData = filteredData.filter(item =>
              Number(item[field]) >= Number(filter.value)
            );
            break;
          default:
            break;
        }
      });
      
      if (sort.length > 0) {
        const { column, direction } = sort[0];
        const sortField = column as keyof MerchantRecord;
        const sortMultiplier = direction === 'asc' ? 1 : -1;
        
        filteredData.sort((a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];
          
          if (aValue == null && bValue == null) return 0;
          if (aValue == null) return 1 * sortMultiplier;
          if (bValue == null) return -1 * sortMultiplier; 
          
          if (aValue < bValue) return -1 * sortMultiplier;
          if (aValue > bValue) return 1 * sortMultiplier;
          return 0;
        });
      }
      
      const startIndex = (pagination.page - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      const pageData = filteredData.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: pageData,
        total: MOCK_DATA.length,
        filtered: filteredData.length
      };
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
          filters: [{ field: 'status', operator: 'equals', value: 'active' }]
        },
        {
          id: 'high-turnover',
          label: t('datatable_demo.filters.high_turnover'),
          filters: [{ field: 'turnover', operator: 'greaterThan', value: 100000 }]
        }
      ]
    },
    selection: {
      enabled: false,
      mode: 'checkbox',
      actions: [
        {
          id: 'export-selected',
          label: t('datatable_demo.actions.export_selected'),
          type: 'button',
          variant: 'outline',
          position: 'bulk',
          handler: ({ selectedIds, selectedCount }: BulkActionContext) => {
            console.log('Exporting selected IDs:', selectedIds);
            console.log('Total selected:', selectedCount);
            alert(`Exporting ${selectedIds.length} items`);
            
            const selectedRows = MOCK_DATA.filter(row => 
              selectedIds.includes(String(row.id))
            );
            console.log('Selected rows:', selectedRows);
          }
        },
        {
          id: 'delete-selected',
          label: t('datatable_demo.actions.delete_selected'),
          type: 'button',
          variant: 'danger',
          position: 'bulk',
          confirm: {
            title: t('datatable_demo.confirm.delete_title'),
            message: t('datatable_demo.confirm.delete_message'),
            confirmText: t('datatable_demo.confirm.delete_confirm'),
            cancelText: t('datatable_demo.confirm.delete_cancel')
          },
          handler: (context: BulkActionContext) => {
            const { selectedIds, selectedCount, datatableState } = context;
            console.log('Exporting selected IDs:', selectedIds);
            console.log('Total selected:', selectedCount);
            
            const selectedRows = MOCK_DATA.filter(row => 
              selectedIds.includes(String(row.id))
            );
            
            console.log('Selected rows:', selectedRows);
            alert(`Exporting ${selectedIds.length} items`);
          }
        }
      ]
    },
    export: {
      enabled: true,
      formats: ['csv', 'excel'],
      columns: ['id', 'merchant', 'status', 'turnover', 'currency']
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
      onRowClick: (row: MerchantRecord, event: React.MouseEvent) => {
        console.log('Row clicked:', row);
      },
      onRowDoubleClick: (row: MerchantRecord, event: React.MouseEvent) => {
        console.log('Row double clicked:', row);
        alert(`Editing merchant: ${row.merchant}`);
      },
      onSelectionChange: (selected: MerchantRecord[]) => {
        console.log('Selection changed:', selected.length);
      },
      onSortChange: (sort: SortState) => {
        console.log('Sort changed:', sort);
      },
      onFilterChange: (filters: Array<{
        field: string;
        operator: string;
        value: unknown;
        value2?: unknown;
      }>) => {
        console.log('Filter changed:', filters);
      }
    },
    quickActions: [
      {
        id: 'add-merchant',
        label: t('datatable_demo.actions.add_merchant'),
        icon: <i className="fas fa-plus"></i>,
        variant: 'primary',
        handler: () => {
          console.log('Add merchant clicked');
        }
      },
      {
        id: 'refresh-data',
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
        handler: (params: { currentRow?: MerchantRecord }) => {
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
        handler: ({ currentRow }: { currentRow?: MerchantRecord }) => {
          console.log('Delete row:', currentRow);
          if (currentRow) {
            console.log(`Deleting merchant: ${currentRow.id} - ${currentRow.merchant}`);
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
      
      <div className="card shadow-sm">
        <div className="card-body p-0">
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