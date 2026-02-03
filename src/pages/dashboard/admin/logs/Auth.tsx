import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Datatable,
  formatTimestampWithTime,
  type DatatableColumn,
  type DatatableConfig,
} from '@/features/datatable-core';
import { LogAuth } from '@/app/entities/logauth';
import { LogAuthService } from '@/app/api/private/logauth/service';
import { RenderClientData } from '@/app/datatable/columns/client_data';
import { RenderCopyInput } from '@/app/datatable/columns/copy_input';
import { RenderLink } from '@/app/datatable/columns/link';

const Auth = () => {
  const { t, i18n } = useTranslation();

  const locale = i18n.language === 'ru' ? 'ru-RU' : 'en-US';

  const columns = useMemo<DatatableColumn<LogAuth>[]>(
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
        render: (row: LogAuth) => (
          <RenderLink
            path={`/panel/users/edit/${row.user_id}`}
            text={`${t('datatable.go_to_user')} (${row.user_id})`}
          />
        ),
      },
      {
        id: 'merchant_id',
        field: 'merchant_id',
        label: t('datatable.merchant_id'),
        sortable: true,
        render: (row: LogAuth) => (
          <RenderLink
            path={`/panel/merchants/edit/${row.merchant_id}`}
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
      },
      {
        id: 'ip',
        field: 'ip',
        label: 'Ip',
        sortable: true,
      },
      {
        id: 'fingerprint',
        field: 'fingerprint',
        label: t('datatable.fingerprint'),
        sortable: true,
        render: (row: LogAuth) => <RenderCopyInput value={row.fingerprint} />,
      },
      {
        id: 'user_agent',
        field: 'user_agent',
        label: 'User-Agent',
        sortable: true,
        render: (row: LogAuth) => <RenderCopyInput value={row.user_agent} />,
      },
      {
        id: 'client_data',
        field: 'client_data',
        label: t('datatable.client_data'),
        sortable: false,
        render: (row: LogAuth) => <RenderClientData clientData={row.client_data} hideBaseData />,
      },
      {
        id: 'created_at',
        field: 'created_at',
        label: t('datatable.created_at'),
        sortable: true,
        render: (row: LogAuth) => formatTimestampWithTime(row.created_at, locale),
      },
      {
        id: 'updated_at',
        field: 'updated_at',
        label: t('datatable.updated_at'),
        sortable: false,
        visible: false,
        render: (row: LogAuth) => formatTimestampWithTime(row.updated_at, locale),
      },
    ],
    [t, locale],
  );

  const config = useMemo<DatatableConfig<LogAuth>>(
    () => ({
      filtersSource: LogAuthService.getFilters,
      dataSource: LogAuthService.getList,
      columns,
    }),
    [columns],
  );
  return <Datatable pageTitle={t('logs_pages.auth')} config={config} className="border-0" />;
};

export default Auth;
