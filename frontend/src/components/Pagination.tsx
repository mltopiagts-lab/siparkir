interface PaginationProps {
  totalItems: number;
  currentPage: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ totalItems, currentPage, pageSize = 5, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="pagination">
      <div className="page-info">Menampilkan {start} - {end} dari {totalItems} data</div>
      <div className="page-controls">
        <button className="page-btn" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
          <button
            key={page}
            className={`page-btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button className="page-btn" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}
