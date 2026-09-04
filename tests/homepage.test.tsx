import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from '../app/page';

describe('academic homepage hero', () => {
  it('identifies Long Xu and his current research role in the first view', () => {
    render(<HomePage />);

    const about = screen.getByRole('region', { name: /Long Xu/i });
    expect(within(about).getByRole('heading', { level: 1, name: /Long Xu/i })).toBeVisible();
    expect(within(about).getByText('Ph.D. Candidate')).toBeVisible();
    expect(within(about).getByText('Sun Yat-sen University')).toBeVisible();
    expect(within(about).getByText(/Edge Intelligence & Wireless Systems/i)).toBeVisible();
  });

  it('offers accessible navigation, contact, and profile links', () => {
    render(<HomePage />);

    const navigation = screen.getByRole('navigation', { name: /primary navigation/i });
    expect(navigation).toBeVisible();
    expect(within(navigation).getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '#about',
    );
    const about = screen.getByRole('region', { name: /Long Xu/i });
    expect(within(about).getByRole('link', { name: /email/i })).toHaveAttribute(
      'href',
      'mailto:xulongbao6@gmail.com',
    );
    expect(within(about).getByRole('link', { name: /google scholar/i })).toHaveAttribute(
      'href',
      'https://scholar.google.com/citations?user=7kqCdhkAAAAJ&hl=en',
    );
    expect(within(about).getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/xulong66',
    );
  });

  it('uses the approved local Scholar portrait with descriptive text', () => {
    render(<HomePage />);

    expect(screen.getByRole('img', { name: /portrait of long xu/i })).toHaveAttribute(
      'src',
      '/long-xu.jpg',
    );
  });
});
