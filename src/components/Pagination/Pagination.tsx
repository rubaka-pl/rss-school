import { Component } from 'react';
import styles from './Pagination.module.css';
import type { PaginationProps } from '../../types/app';

export default class Pagination extends Component<PaginationProps> {
  render() {
    const { offset, total, pageSize, onPageChange } = this.props;
    const totalPages = Math.ceil(total / pageSize);
    const currentPage = Math.floor(offset / pageSize) + 1;

    return (
      <div className={styles.controls}>
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
  }
}
