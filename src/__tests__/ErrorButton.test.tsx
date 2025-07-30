import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import BottomSection from '../components/BottomSection/BottomSection';
import { MemoryRouter } from 'react-router-dom';

describe('BottomSection – Throw Error button', () => {
  it('calls onErrorButton when Throw Error is clicked', async () => {
    const onErrorButton = vi.fn();
    const mockSetSearchParams = vi.fn();
    const mockSearchParams = new URLSearchParams();
    render(
      <MemoryRouter>
        <BottomSection
          results={[]}
          onResetButton={() => {}}
          onErrorButton={onErrorButton}
          setSearchParams={mockSetSearchParams}
          searchParams={mockSearchParams}
        />
      </MemoryRouter>
    );

    const btn = screen.getByRole('button', { name: /throw error/i });
    await userEvent.click(btn);
    expect(onErrorButton).toHaveBeenCalledTimes(1);
  });
});
