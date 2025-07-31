import styles from './Pagination.module.css';
import type { PaginationProps } from '../../types/app';

const Pagination = ({
  offset,
  total,
  pageSize,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);
  const currentPage = Math.floor(offset / pageSize) + 1;

  return (
    <div className={styles.controls} data-testid="pager">
      <button
        className={styles.button}
        onClick={() => onPageChange(offset - pageSize)}
        disabled={currentPage === 1}
      >
        ‹ Prev
      </button>
      <span className={styles.info}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className={styles.button}
        onClick={() => onPageChange(offset + pageSize)}
        disabled={currentPage === totalPages}
      >
        Next ›
      </button>
    </div>
  );
};

export default Pagination;
