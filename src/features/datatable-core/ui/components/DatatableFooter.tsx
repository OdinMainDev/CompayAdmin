import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { Form, Pagination } from 'react-bootstrap';
import { DatatableEngine } from '../../runtime/DatatableEngine';
import { useDatatableState } from '../hooks/useDatatableState';

interface DatatableFooterProps<T = unknown> {
  engine: DatatableEngine<T>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function DatatableFooter<T>({
  engine,
  onPageChange,
  onPageSizeChange
}: DatatableFooterProps<T>): React.ReactElement | null {
  const state = useDatatableState(engine); 
  const { page, pageSize, totalPages, pageSizeOptions } = state.pagination;
  const { filtered, total } = state;
  const { t } = useTranslation("panel");
  
  if (filtered <= pageSize && page === 1) {
    return (
      <div className="datatable-footer py-4 px-3">
        <div className="footer-info">
          {t("datatable.show_all_entries")} ({filtered})
        </div>
      </div>
    );
  }
  
  const handleFirstPage = () => {
    if (page > 1) {
      onPageChange(1);
    }
  };
  
  const handlePrevPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };
  
  const handleLastPage = () => {
    if (page < totalPages) {
      onPageChange(totalPages);
    }
  };
  
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    onPageSizeChange(newSize);
  };
  
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Pagination.Item key={i} active={i === page} onClick={() => onPageChange(i)} className={`text-black`}>
          {i}
        </Pagination.Item>
      );
    }
    
    return pages;
  };
  
  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, filtered);
  
  return (
    <>
      {!state.error && (
        <div className="datatable-footer d-flex justify-content-between py-4 px-3">
          <div className="footer-info">
            {t("datatable.showing")} {startRecord} {t("datatable.to")} {endRecord} {t("datatable.of")} {filtered} {t("datatable.entries")}
            {filtered !== total && ` (${t("datatable.total_entries")}: ${total})`}
          </div>
          
          <div className="footer-pagination d-flex align-items-center gap-3">
            <Form.Select
              value={pageSize}
              onChange={handlePageSizeChange}
              disabled={state.loading}
              style={{ width: '4vw' }}
            >
              {pageSizeOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
  
            <Pagination className="mb-0">
              <Pagination.First
                onClick={handleFirstPage}
                disabled={page === 1 || state.loading}
                className='text-black'
              >
                <FontAwesomeIcon icon={faAnglesLeft} />
              </Pagination.First>
  
              <Pagination.Prev
                onClick={handlePrevPage}
                disabled={page === 1 || state.loading}
                className='text-black'
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </Pagination.Prev>
  
              {renderPageNumbers()}
  
              <Pagination.Next
                onClick={handleNextPage}
                disabled={page === totalPages || state.loading}
                className='text-black'
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </Pagination.Next>
  
              <Pagination.Last
                onClick={handleLastPage}
                disabled={page === totalPages || state.loading}
                className='text-black'
              >
                <FontAwesomeIcon icon={faAnglesRight} />
              </Pagination.Last>
            </Pagination>
          </div>
  
        </div>
      )}
    </>
  );
  
}