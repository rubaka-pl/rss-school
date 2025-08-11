import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import SearchInput from '../components/SearchInput/SearchInput';
import type { SearchInputProps } from '../types/app';
import styles from '../components/SearchInput/SearchInput.module.css';

describe('SearchInput', () => {
  const onChange = vi.fn();
  const onSearch = vi.fn();
  const onSuggestionClick = vi.fn();

  const renderComponent = (props?: Partial<SearchInputProps>) => {
    render(
      <SearchInput
        value=""
        suggestions={[]}
        onChange={onChange}
        onSearch={onSearch}
        onSuggestionClick={onSuggestionClick}
        {...props}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the input and Search button', () => {
    renderComponent();

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass(styles.input);

    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(styles.button);
  });

  it('does not show the suggestions list when empty', () => {
    renderComponent({ suggestions: [] });
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders the suggestions list when provided', () => {
    const items = ['apple', 'banana', 'cherry'];
    renderComponent({ suggestions: items });

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass(styles.suggestionsList);

    const renderedItems = screen.getAllByRole('listitem');
    expect(renderedItems).toHaveLength(items.length);
    items.forEach((item, i) => {
      expect(renderedItems[i]).toHaveTextContent(item);
    });
  });

  it('calls onChange once per character input', async () => {
    renderComponent();
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test');
    expect(onChange).toHaveBeenCalledTimes(4);
    expect(onChange.mock.calls).toEqual([['t'], ['e'], ['s'], ['t']]);
  });

  it('calls onSearch on button click', async () => {
    renderComponent();
    const button = screen.getByRole('button', { name: /search/i });
    await userEvent.click(button);
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch on Enter key press', async () => {
    renderComponent();
    const input = screen.getByRole('textbox');
    input.focus();
    await userEvent.keyboard('{Enter}');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('calls onSuggestionClick when a suggestion is clicked', async () => {
    const items = ['foo', 'bar'];
    renderComponent({ suggestions: items });
    const renderedItems = screen.getAllByRole('listitem');
    await userEvent.click(renderedItems[1]);
    expect(onSuggestionClick).toHaveBeenCalledWith('bar');
  });
});
