import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Datatable,
  formatTimestampWithTime,
  type DatatableColumn,
  type DatatableConfig,
} from '@/features/datatable-core';
import { User } from '@/app/entities/user';
import { UserService } from '@/app/api/private/user/service';
import { buildAddAction } from '@/features/datatable-core/utils/buildAddAction';
import { buildEditAction } from '@/features/datatable-core/utils/buildEditAction';
import { RenderBool } from '@/app/datatable/columns/bool';
import { RenderLink } from '@/app/datatable/columns/link';

const List = () => {
  const { t, i18n } = useTranslation();
  // const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  // const refreshTable = useCallback(() => {
  //   setRefreshKey((prev) => prev + 1);
  // }, []);

  const locale = i18n.language === 'ru' ? 'ru-RU' : 'en-US';

  const columns = useMemo<DatatableColumn<User>[]>(
    () => [
      {
        id: 'id',
        field: 'id',
        label: 'ID',
        sortable: true,
      },
      {
        id: 'username',
        field: 'username',
        label: t('datatable.username'),
        sortable: true,
      },
      {
        id: 'is_banned',
        field: 'is_banned',
        label: t('datatable.is_banned'),
        sortable: true,
        render: (row: User) => <RenderBool value={row.is_banned} />,
      },
      {
        id: 'is_twofa_enabled',
        field: 'is_twofa_enabled',
        label: t('datatable.is_twofa_enabled'),
        sortable: false,
        visible: false,
        render: (row: User) => <RenderBool value={row.is_twofa_enabled} />,
      },
      {
        id: 'merchant_id',
        field: 'merchant_id',
        label: t('datatable.merchant_id'),
        sortable: true,
        render: (row: User) => (
          <RenderLink
            path={`/dashboard/merchants/edit/${row.merchant_id}`}
            text={`${t('datatable.go_to_merchant')} (${row.merchant_id})`}
          />
        ),
      },
      {
        id: 'creator_id',
        field: 'creator_id',
        label: t('datatable.creator_id'),
        sortable: true,
        render: (row: User) => (
          <RenderLink
            path={`/dashboard/users/edit/${row.creator_id}`}
            text={`${t('datatable.go_to_user')} (${row.creator_id})`}
          />
        ),
      },
      {
        id: 'created_at',
        field: 'created_at',
        label: t('datatable.created_at'),
        sortable: true,
        render: (row: User) => formatTimestampWithTime(row.created_at, locale),
      },
      {
        id: 'updated_at',
        field: 'updated_at',
        label: t('datatable.updated_at'),
        sortable: false,
        visible: false,
        render: (row: User) => formatTimestampWithTime(row.updated_at, locale),
      },
    ],
    [t, locale],
  );

  const config = useMemo<DatatableConfig<User>>(
    () => ({
      filtersSource: UserService.getFilters,
      dataSource: UserService.getList,
      columns,
      quickActions: [
        buildAddAction(t('datatable.add_record'), '/dashboard/users/create', navigate),
      ],
      rowActions: [
        buildEditAction('/dashboard/users/edit/', navigate),
        // buildDeleteAction(UserService.delete, refreshTable),
      ],
    }),
    [columns, t],
  );
  return <Datatable pageTitle={t('users_page.list')} key={0} config={config} />;
};

export default List;
