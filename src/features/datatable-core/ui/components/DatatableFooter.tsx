import React from 'react';
import type { DatatableState } from '../../domain/entities/DatatableState';

interface DatatableFooterProps<T = unknown> {
  state: DatatableState<T>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function DatatableFooter<T = unknown>({
  state,
  onPageChange,
  onPageSizeChange
}: DatatableFooterProps<T>): React.ReactElement | null {
  const { page, pageSize, totalPages } = state.pagination;
  const { filtered, total } = state;
  const pageSizeOptions = [10, 25, 50, 100];
  
  if (filtered <= pageSize && page === 1) {
    return (
      <div className="datatable-footer mt-[10px]">
        <div className="footer-info">
          Showing all {filtered} entries
          {filtered !== total && ` (filtered from ${total} total entries)`}
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
        <button
          key={i}
          className={`btn btn-sm ${i === page ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => onPageChange(i)}
          disabled={state.loading}
        >
          {i}
        </button>
      );
    }
    
    return pages;
  };
  
  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, filtered);
  
  return (
    <div className="datatable-footer flex justify-between mt-[10px]">
      <div className="footer-info">
        Showing {startRecord} to {endRecord} of {filtered} entries
        {filtered !== total && ` (filtered from ${total} total entries)`}
      </div>
      
      <div className="footer-pagination">
        <div className="pagination-controls d-flex align-items-center gap-3">
          <div className="btn-group">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleFirstPage}
              disabled={page === 1 || state.loading}
              title="First page"
            >
              <i className="fas fa-angle-double-left"></i>
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handlePrevPage}
              disabled={page === 1 || state.loading}
              title="Previous page"
            >
              <i className="fas fa-angle-left"></i>
            </button>
            
            {renderPageNumbers()}
            
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleNextPage}
              disabled={page === totalPages || state.loading}
              title="Next page"
            >
              <i className="fas fa-angle-right"></i>
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleLastPage}
              disabled={page === totalPages || state.loading}
              title="Last page"
            >
              <i className="fas fa-angle-double-right"></i>
            </button>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Show:</span>
            <select
              className="form-select form-select-sm !pr-[20px]"
              value={pageSize}
              onChange={handlePageSizeChange}
              disabled={state.loading}
              style={{ width: 'auto' }}
            >
              {pageSizeOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-muted small">per page</span>
          </div>
        </div>
      </div>
    </div>
  );
}