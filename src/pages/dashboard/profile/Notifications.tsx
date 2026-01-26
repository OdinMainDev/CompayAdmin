import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Datatable, 
  formatTimestampWithTime,
  type DatatableColumn, 
  type DatatableConfig 
} from '@/features/datatable-core';
import { Notification } from '@/app/entities/notification';
import { NotificationService } from '@/app/api/notification/service';
import { RenderCopyTextarea } from '@/app/datatable/columns/copy_textarea';
import { RenderBool } from '@/app/datatable/columns/bool';

const Notifications = () => {
  const { t, i18n } = useTranslation();
  
  const locale = i18n.language === 'ru' ? 'ru-RU' : 'en-US';

  const columns = useMemo<DatatableColumn<Notification>[]>(() => [
    {
        id: 'id',
        field: 'id',
        label: 'ID',
        sortable: true,
    },
    {
        id: 'action',
        field: 'action',
        label: t('datatable.action'),
        sortable: true,
    },
    {
        id: 'is_read',
        field: 'is_read',
        label: t('datatable.is_read'),
        sortable: true,
        render: (row: Notification) => <RenderBool value={row.is_read}/>,
    },
    {
        id: 'text',
        field: 'text',
        label: t('datatable.text'),
        sortable: false,
        render: (row: Notification) => <RenderCopyTextarea value={row.text}/>,
    },
    {
        id: 'created_at',
        field: 'created_at',
        label: t('datatable.created_at'),
        sortable: true,
        render: (row: Notification) => formatTimestampWithTime(row.created_at, locale),
    },
    {
        id: 'updated_at',
        field: 'updated_at',
        label: t('datatable.updated_at'),
        sortable: false,
        visible: false,
        render: (row: Notification) => formatTimestampWithTime(row.updated_at, locale),
    },
  ], [t, locale]);

  const config = useMemo<DatatableConfig<Notification>>(() => (
    {
        filtersSource:  NotificationService.getFilters,
        dataSource:     NotificationService.getList,
        columns,
    }), [columns, t]);

  return (
    <Datatable
      config={config}
      className="border-0"
    />
  );
};

export default Notifications;