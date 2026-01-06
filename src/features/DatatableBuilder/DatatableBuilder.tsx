import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Pagination, Spinner, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type { IDatatableFilters, IResponseError, IResponseList, TableColumn } from './types';

interface DatatableBuilderProps<T> {
  title?: string;
  subtitle?: string;
  columns: TableColumn<T>[];
  getListDataApi: (filters: IDatatableFilters) => Promise<IResponseList<T> | IResponseError>;
  onAddClick?: () => void;
  addLabel?: string;
  pageSizeOptions?: number[];
}

const DatatableBuilder = <T,>({
  title,
  subtitle,
  columns,
  getListDataApi,
  onAddClick,
  addLabel,
  pageSizeOptions = [10, 25, 50],
}: DatatableBuilderProps<T>) => {
  const { t } = useTranslation();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0] ?? 10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState<{ column: string; direction: 'asc' | 'desc' }>({
    column: columns[0]?.value ?? 'id',
    direction: 'asc',
  });

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const filters: IDatatableFilters = {
      length: pageSize,
      start: page * pageSize,
      order_column: sort.column,
      order_direction: sort.direction,
    };

    try {
      const response = await getListDataApi(filters);
      if ('success' in response && response.success) {
        setData(response.data.data ?? []);
        setTotal(response.data.recordsFiltered ?? response.data.recordsCount ?? 0);
      } else {
        setData([]);
        setTotal(0);
      }
    } finally {
      setLoading(false);
    }
  }, [getListDataApi, page, pageSize, sort.column, sort.direction]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;
    setSort((prev) => ({
      column: column.value,
      direction: prev.column === column.value && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    const items = [];
    for (let number = 1; number <= totalPages; number += 1) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === page + 1}
          onClick={() => setPage(number - 1)}
        >
          {number}
        </Pagination.Item>,
      );
    }

    return <Pagination className="mb-0">{items}</Pagination>;
  };

  return (
    <Card className="shadow-sm border">
      <Card.Body>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
          <div className="mb-3 mb-md-0">
            {title && <h5 className="mb-1">{title}</h5>}
            {subtitle && <div className="text-muted">{subtitle}</div>}
          </div>
          <div className="d-flex align-items-center gap-2">
            <Form.Select
              size="sm"
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(0);
              }}
              className="w-auto"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {t('datatable.page_size_option', { size })}
                </option>
              ))}
            </Form.Select>
            {onAddClick && (
              <Button variant="primary" size="sm" onClick={onAddClick}>
                {addLabel ?? t('datatable.add_record')}
              </Button>
            )}
          </div>
        </div>

        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.value}
                    role={column.sortable ? 'button' : undefined}
                    className={column.align ? `text-${column.align}` : undefined}
                    onClick={() => handleSort(column)}
                  >
                    <div className="d-flex align-items-center gap-1">
                      <span>{column.label}</span>
                      {column.sortable && sort.column === column.value && (
                        <span className="text-muted small">
                          {sort.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                    {t('datatable.loading')}
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4 text-muted">
                    {t('datatable.empty')}
                  </td>
                </tr>
              ) : (
                data.map((row, idx: number) => (
                  <tr key={idx}>
                    {columns.map((column) => (
                      <td
                        key={`${column.value}-${idx}`}
                        className={column.align ? `text-${column.align}` : undefined}
                      >
                      {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.value] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          

        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
          <div className="text-muted small mb-2 mb-md-0">
            {t('datatable.summary', { count: data.length, total })}
          </div>
          {renderPagination()}
        </div>
      </Card.Body>
    </Card>
  );
};

export default DatatableBuilder;
