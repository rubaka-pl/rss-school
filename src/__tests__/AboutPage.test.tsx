import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AboutPage from '../pages/AboutPage/AboutPage';

describe('AboutPage', () => {
  it('renders project title and description', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /About the Pokédex Project/i })
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /RS School/i })).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );

    expect(screen.getByText(/Search by name/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Pagination with URL synchronization/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Detail view with dynamic routing/i)
    ).toBeInTheDocument();

    const githubLink = screen.getByRole('link', {
      name: /https:\/\/github\.com\/rubaka-pl/i,
    });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/rubaka-pl');

    expect(
      screen.getByRole('link', { name: /Back to Pokédex/i })
    ).toHaveAttribute('href', '/');
  });
});
