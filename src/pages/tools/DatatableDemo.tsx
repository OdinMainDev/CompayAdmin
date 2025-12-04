import { useCallback } from 'react';
import DatatableBuilder from '../../features/DatatableBuilder';
import { IDatatableFilters, IResponseError, IResponseList, TableColumn } from '../../features/DatatableBuilder/types';
import PageHeader from '../../components/common/PageHeader';

interface MerchantRecord {
  id: number;
  merchant: string;
  status: 'active' | 'paused' | 'blocked';
  turnover: number;
  currency: string;
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

const DatatableDemo = () => {
  const columns: TableColumn<MerchantRecord>[] = [
    { label: 'ID', value: 'id', sortable: true },
    { label: 'Мерчант', value: 'merchant', sortable: true },
    {
      label: 'Статус',
      value: 'status',
      sortable: true,
      render: (row) => (
        <span
          className={`badge bg-${
            row.status === 'active' ? 'success' : row.status === 'paused' ? 'warning' : 'danger'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      label: 'Оборот',
      value: 'turnover',
      sortable: true,
      render: (row) => `${row.turnover.toLocaleString('ru-RU')} ${row.currency}`,
      align: 'end',
    },
    { label: 'Валюта', value: 'currency', sortable: true, align: 'center' },
  ];

  const getListDataApi = useCallback(
    async (filters: IDatatableFilters): Promise<IResponseList<MerchantRecord> | IResponseError> => {
      const sortKey = (filters.order_column as keyof MerchantRecord) || 'id';
      const sorted = [...MOCK_DATA].sort((a, b) => {
        const dir = filters.order_direction === 'asc' ? 1 : -1;
        if (a[sortKey] < b[sortKey]) {
          return -1 * dir;
        }
        if (a[sortKey] > b[sortKey]) {
          return 1 * dir;
        }
        return 0;
      });

      const pageData = sorted.slice(filters.start, filters.start + filters.length);

      return {
        success: true,
        data: {
          recordsCount: MOCK_DATA.length,
          recordsFiltered: MOCK_DATA.length,
          recordsTotal: MOCK_DATA.length,
          data: pageData,
        },
      };
    },
    [],
  );

  return (
    <>
      <PageHeader
        title="Datatable Builder"
        subtitle="Обновлённый вид: базовая таблица с сортировкой, пагинацией и кнопкой действий."
        trail={[{ label: 'Инструменты' }, { label: 'Datatable' }]}
      />
      <DatatableBuilder
        title="Мерчанты"
        subtitle="Структура повторяет старый API: length/start/order_column/order_direction."
        columns={columns}
        getListDataApi={getListDataApi}
        onAddClick={() => undefined}
        addLabel="Добавить мерчанта"
      />
    </>
  );
};

export default DatatableDemo;
