import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Pagination from '../components/Pagination/Pagination';
import styles from '../components/Pagination/Pagination.module.css';

describe('Pagination', () => {
  const onPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders current page and total pages correctly', () => {
    render(
      <Pagination
        offset={20}
        total={50}
        pageSize={10}
        onPageChange={onPageChange}
      />
    );
    expect(
      screen.getByText('Page 3 of 5', { selector: `.${styles.info}` })
    ).toBeInTheDocument();
  });

  it('disables Prev button on first page', () => {
    render(
      <Pagination
        offset={0}
        total={30}
        pageSize={10}
        onPageChange={onPageChange}
      />
    );
    const prev = screen.getByRole('button', { name: /prev/i });
    expect(prev).toBeDisabled();
    const next = screen.getByRole('button', { name: /next/i });
    expect(next).toBeEnabled();
  });

  it('disables Next button on last page', () => {
    render(
      <Pagination
        offset={20}
        total={25}
        pageSize={10}
        onPageChange={onPageChange}
      />
    );
    const next = screen.getByRole('button', { name: /next/i });
    expect(next).toBeDisabled();
    const prev = screen.getByRole('button', { name: /prev/i });
    expect(prev).toBeEnabled();
  });

  it('calls onPageChange with offset-pageSize when Prev clicked', async () => {
    render(
      <Pagination
        offset={20}
        total={100}
        pageSize={10}
        onPageChange={onPageChange}
      />
    );
    const prev = screen.getByRole('button', { name: /prev/i });
    await userEvent.click(prev);
    expect(onPageChange).toHaveBeenCalledWith(10);
  });

  it('calls onPageChange with offset+pageSize when Next clicked', async () => {
    render(
      <Pagination
        offset={20}
        total={100}
        pageSize={10}
        onPageChange={onPageChange}
      />
    );
    const next = screen.getByRole('button', { name: /next/i });
    await userEvent.click(next);
    expect(onPageChange).toHaveBeenCalledWith(30);
  });
});
