import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import BottomSection from '../components/BottomSection/BottomSection';

describe('BottomSection – Throw Error button', () => {
  it('calls onErrorButton when Throw Error is clicked', async () => {
    const onErrorButton = vi.fn();
    render(
      <BottomSection
        results={[]}
        onResetButton={() => {}}
        onErrorButton={onErrorButton}
      />
    );

    const btn = screen.getByRole('button', { name: /throw error/i });
    await userEvent.click(btn);
    expect(onErrorButton).toHaveBeenCalledTimes(1);
  });
});
