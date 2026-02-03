import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Datatable,
  formatTimestampWithTime,
  type DatatableColumn,
  type DatatableConfig,
} from '@/features/datatable-core';
import { Currency } from '@/app/entities/currency';
import { CurrencyService } from '@/app/api/private/currency/service';
import { buildAddAction } from '@/features/datatable-core/utils/buildAddAction';
import { buildEditAction } from '@/features/datatable-core/utils/buildEditAction';
import { RenderBool } from '@/app/datatable/columns/bool';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';

const List = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const importCurrencies = useCallback(async (): Promise<void> => {
    await CurrencyService.import();
  }, []);

  const locale = i18n.language === 'ru' ? 'ru-RU' : 'en-US';

  const columns = useMemo<DatatableColumn<Currency>[]>(
    () => [
      {
        id: 'id',
        field: 'id',
        label: 'ID',
        sortable: true,
      },
      {
        id: 'image',
        field: 'image',
        label: t('datatable.image'),
        sortable: false,
      },
      {
        id: 'title',
        field: 'title',
        label: t('datatable.name'),
        sortable: true,
      },
      {
        id: 'code_alpha',
        field: 'code_alpha',
        label: t('datatable.code_alpha'),
        sortable: true,
      },
      {
        id: 'network',
        field: 'network',
        label: t('datatable.network'),
        sortable: true,
      },
      {
        id: 'minor_units',
        field: 'minor_units',
        label: t('datatable.minor_units'),
        sortable: true,
      },
      {
        id: 'is_coin',
        field: 'is_coin',
        label: t('datatable.is_coin'),
        sortable: true,
        render: (row: Currency) => <RenderBool value={row.is_coin} />,
      },
      {
        id: 'created_at',
        field: 'created_at',
        label: t('datatable.created_at'),
        sortable: true,
        render: (row: Currency) => formatTimestampWithTime(row.created_at, locale),
      },
      {
        id: 'updated_at',
        field: 'updated_at',
        label: t('datatable.updated_at'),
        sortable: false,
        visible: false,
        render: (row: Currency) => formatTimestampWithTime(row.updated_at, locale),
      },
    ],
    [t, locale],
  );

  const config = useMemo<DatatableConfig<Currency>>(
    () => ({
      filtersSource: CurrencyService.getFilters,
      dataSource: CurrencyService.getList,
      columns,
      quickActions: [
        buildAddAction(t('datatable.add_record'), '/panel/currencies/process/0', navigate),
        {
          id: 'import',
          label: t('currencies_page.import'),
          icon: <FontAwesomeIcon icon={faFileImport} />,
          variant: 'warning',
          handler: importCurrencies,
        },
      ],
      rowActions: [buildEditAction('/panel/currencies/process/', navigate)],
    }),
    [columns, importCurrencies, navigate, t],
  );
  return <Datatable pageTitle={t('currencies_page.list')} key={0} config={config} />;
};

export default List;
