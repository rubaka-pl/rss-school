import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import { Provider } from 'react-redux';
import { store } from '../store/store';
describe('NotFoundPage', () => {
  it('renders 404 heading, message, and link to home', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '404 - Page Not Found'
    );
    expect(
      screen.getByText(/The page you're looking for doesn't exist/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /go back to home/i })
    ).toHaveAttribute('href', '/');
  });
});
