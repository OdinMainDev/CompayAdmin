import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Datatable,
  formatTimestampWithTime,
  type DatatableColumn,
  type DatatableConfig,
} from '@/features/datatable-core';
import { LogUser } from '@/app/entities/loguser';
import { LogUserService } from '@/app/api/private/loguser/service';
import { RenderClientData } from '@/app/datatable/columns/client_data';
import { RenderCopyTextarea } from '@/app/datatable/columns/copy_textarea';
import { RenderLink } from '@/app/datatable/columns/link';

const User = () => {
  const { t, i18n } = useTranslation();

  const locale = i18n.language === 'ru' ? 'ru-RU' : 'en-US';

  const columns = useMemo<DatatableColumn<LogUser>[]>(
    () => [
      {
        id: 'id',
        field: 'id',
        label: 'ID',
        sortable: true,
      },
      {
        id: 'user_id',
        field: 'user_id',
        label: t('datatable.user_id'),
        sortable: true,
        render: (row: LogUser) => (
          <RenderLink
            path={`/dashboard/users/edit/${row.user_id}`}
            text={`${t('datatable.go_to_user')} (${row.user_id})`}
          />
        ),
      },
      {
        id: 'merchant_id',
        field: 'merchant_id',
        label: t('datatable.merchant_id'),
        sortable: true,
        render: (row: LogUser) => (
          <RenderLink
            path={`/dashboard/merchants/edit/${row.merchant_id}`}
            text={`${t('datatable.go_to_merchant')} (${row.merchant_id})`}
          />
        ),
      },
      {
        id: 'action',
        field: 'action',
        label: t('datatable.action'),
        sortable: true,
      },
      {
        id: 'url',
        field: 'url',
        label: 'URL',
        sortable: true,
        render: (row) => (
        <span
        style={{
          display: 'block',
          maxWidth: 200,
          maxHeight: 200,
          overflow: 'auto',
          whiteSpace: 'nowrap',
          paddingBottom: 2,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="hide-scroll"
        title={row.url}
        >
        {row.url}
      </span>
    ),
      },
      {
        id: 'request',
        field: 'request',
        label: t('datatable.request'),
        sortable: true,
        render: (row: LogUser) => <RenderCopyTextarea value={row.request} />,
      },
      {
        id: 'client_data',
        field: 'client_data',
        label: t('datatable.client_data'),
        sortable: false,
        render: (row: LogUser) => <RenderClientData clientData={row.client_data} />,
      },
      {
        id: 'created_at',
        field: 'created_at',
        label: t('datatable.created_at'),
        sortable: true,
        render: (row: LogUser) => formatTimestampWithTime(row.created_at, locale),
      },
      {
        id: 'updated_at',
        field: 'updated_at',
        label: t('datatable.updated_at'),
        sortable: false,
        visible: false,
        render: (row: LogUser) => formatTimestampWithTime(row.updated_at, locale),
      },
    ],
    [t, locale],
  );

  const config = useMemo<DatatableConfig<LogUser>>(
    () => ({
      filtersSource: LogUserService.getFilters,
      dataSource: LogUserService.getList,
      columns,
    }),
    [columns],
  );
  return <Datatable pageTitle={t('logs_pages.user')} config={config} className="border-0" />;
};

export default User;
