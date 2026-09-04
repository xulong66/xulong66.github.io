import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from '../app/page';

const navigation = [
  ['About', '#about'],
  ['Research', '#research'],
  ['News', '#news'],
  ['Publications', '#publications'],
  ['Education', '#education'],
  ['Contact', '#contact'],
] as const;

describe('complete academic homepage', () => {
  it('connects the primary navigation to all six approved sections', () => {
    render(<HomePage />);

    const primaryNavigation = screen.getByRole('navigation', {
      name: 'Primary navigation',
    });
    const links = within(primaryNavigation).getAllByRole('link');
    expect(links).toHaveLength(navigation.length);

    for (const [label, href] of navigation) {
      expect(within(primaryNavigation).getByRole('link', { name: label })).toHaveAttribute(
        'href',
        href,
      );
    }
  });

  it('renders the verified research themes and news timeline', () => {
    render(<HomePage />);

    const research = screen.getByRole('region', { name: 'Research' });
    expect(within(research).getAllByRole('article')).toHaveLength(3);
    expect(within(research).getByRole('heading', { name: 'Intelligent Edge Computing' })).toBeVisible();
    expect(within(research).getByRole('heading', { name: 'Multi-Agent Reinforcement Learning' })).toBeVisible();
    expect(within(research).getByRole('heading', { name: 'Vehicular & Wireless Networks' })).toBeVisible();

    const news = screen.getByRole('region', { name: 'News' });
    expect(within(news).getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders exactly three verified publications with exact DOI links', () => {
    render(<HomePage />);

    const publications = screen.getByRole('region', { name: 'Selected Publications' });
    const papers = within(publications).getAllByRole('article');
    expect(papers).toHaveLength(3);

    const dois = [
      'https://doi.org/10.1016/j.dcan.2025.09.002',
      'https://doi.org/10.1109/WCNC61545.2025.10978374',
      'https://doi.org/10.1016/j.dcan.2024.03.008',
    ];

    papers.forEach((paper, index) => {
      const paperLink = within(paper).getByRole('link', { name: /open paper/i });
      expect(paperLink).toHaveAttribute('href', dois[index]);
      expect(paperLink).toHaveAttribute('target', '_blank');
      expect(paperLink).toHaveAttribute('rel', 'noreferrer');
      expect(within(paper).getByText('Long Xu').tagName).toBe('STRONG');
    });
  });

  it('renders education and complete contact destinations', () => {
    render(<HomePage />);

    const education = screen.getByRole('region', { name: 'Education' });
    expect(within(education).getAllByRole('listitem')).toHaveLength(2);
    expect(within(education).getByRole('heading', { name: 'Ph.D. Candidate' })).toBeVisible();
    expect(within(education).getByRole('heading', { name: 'B.S. in Communication Engineering' })).toBeVisible();

    const contact = screen.getByRole('region', { name: 'Contact' });
    expect(within(contact).getByRole('link', { name: 'xulongbao6@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:xulongbao6@gmail.com',
    );
    expect(within(contact).getByRole('link', { name: 'Google Scholar' })).toHaveAttribute(
      'href',
      'https://scholar.google.com/citations?user=7kqCdhkAAAAJ&hl=en',
    );
    expect(within(contact).getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/xulong66',
    );
    expect(within(contact).getByRole('link', { name: 'ORCID' })).toHaveAttribute(
      'href',
      'https://orcid.org/0009-0002-8075-2589',
    );
  });
});
