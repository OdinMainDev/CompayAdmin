import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Datatable, 
  formatTimestampWithTime,
  type DatatableColumn, 
  type DatatableConfig 
} from '@/features/datatable-core';
import { Merchant } from '@/app/entities/merchant';
import { MerchantService } from '@/app/api/merchant/service';
import { buildAddAction } from '@/features/datatable-core/utils/buildAddAction';
import { buildEditAction } from '@/features/datatable-core/utils/buildEditAction';
import { RenderBool } from '@/app/datatable/columns/bool';
import { Button } from 'react-bootstrap';

const List = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const locale = i18n.language === 'ru' ? 'ru-RU' : 'en-US';

  const columns = useMemo<DatatableColumn<Merchant>[]>(() => [
    {
      id: 'id',
      field: 'id',
      label: 'ID',
      sortable: true,
    },
    {
      id: 'name',
      field: 'name',
      label: t('datatable.name'),
      sortable: true,
    },
    {
      id: 'is_enabled',
      field: 'is_enabled',
      label: t('datatable.is_enabled'),
      sortable: true,
      render: (row: Merchant) => <RenderBool value={row.is_enabled}/>,
    },
    {
      id: 'creator_id',
      field: 'creator_id',
      label: t('datatable.creator_id'),
      sortable: true,
      render: (row: Merchant) => {
        return (
          <Link to={`/dashboard/merchants/edit/${row.creator_id}`}>
              <Button bsPrefix="text" variant="info">
                {t('datatable.go_to_user')} ({row.creator_id})
              </Button>
          </Link>
        );
      },
    },
    {
      id: 'admin_id',
      field: 'admin_id',
      label: t('datatable.owner_id'),
      sortable: true,
      render: (row: Merchant) => {
        return (
          <Link to={`/dashboard/merchants/edit/${row.owner_id}`}>
              <Button bsPrefix="text" variant="info">
                {t('datatable.go_to_user')} ({row.creator_id})
              </Button>
          </Link>
        );
      },
    },
    {
      id: 'created_at',
      field: 'created_at',
      label: t('datatable.created_at'),
      sortable: true,
      render: (row: Merchant) => formatTimestampWithTime(row.created_at, locale),
    },
    {
      id: 'updated_at',
      field: 'updated_at',
      label: t('datatable.updated_at'),
      sortable: false,
      visible: false,
      render: (row: Merchant) => formatTimestampWithTime(row.updated_at, locale),
    },
  ], [t, locale]);

  const config = useMemo<DatatableConfig<Merchant>>(() => ({
    filtersSource:  MerchantService.getFilters,
    dataSource:     MerchantService.getList,
    columns,
    quickActions: [
      buildAddAction(t('datatable.add_record'), '/dashboard/merchants/create', navigate)
    ],
    rowActions: [
      buildEditAction('/dashboard/merchants/edit/', navigate),
    ]
  }), [columns, t]);
  return (
    <Datatable
      pageTitle={t('merchants_page.list')}
      key={0}
      config={config}
    />
  );
};

export default List;