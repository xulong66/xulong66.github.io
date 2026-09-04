import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from '../app/page';

const navigation = [
  ['About', '#about'],
  ['Research', '#research'],
  ['News', '#news'],
  ['Publications', '#publications'],
  ['Patents', '#patents'],
  ['Teaching', '#teaching'],
  ['Education', '#education'],
  ['Contact', '#contact'],
] as const;

describe('complete academic homepage', () => {
  it('connects the primary navigation to all eight approved sections', () => {
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
    expect(within(news).getAllByRole('listitem')).toHaveLength(4);
    expect(
      within(news).getByText(/MH-GAT-MAPPO-based adaptive offloading/i),
    ).toBeVisible();
  });

  it('renders the accepted FCN paper first with all verified publication links', () => {
    render(<HomePage />);

    const publications = screen.getByRole('region', { name: 'Selected Publications' });
    const papers = within(publications).getAllByRole('article');
    expect(papers).toHaveLength(4);

    const publicationLinks = [
      'https://www.future-forum.org.cn/en/fcn2026/About.html',
      'https://doi.org/10.1016/j.dcan.2025.09.002',
      'https://doi.org/10.1109/WCNC61545.2025.10978374',
      'https://doi.org/10.1016/j.dcan.2024.03.008',
    ];

    papers.forEach((paper, index) => {
      const paperLink = within(paper).getByRole('link', { name: /open paper/i });
      expect(paperLink).toHaveAttribute('href', publicationLinks[index]);
      expect(paperLink).toHaveAttribute('target', '_blank');
      expect(paperLink).toHaveAttribute('rel', 'noreferrer');
      expect(within(paper).getByText('Long Xu').tagName).toBe('STRONG');
    });
    expect(
      within(papers[0]).getByRole('heading', {
        name: 'Adaptive Offloading Based on MH-GAT-MAPPO for Satellite-Terrestrial Integration Systems',
      }),
    ).toBeVisible();
    expect(within(papers[0]).getByText('Conference · Accepted')).toBeVisible();
    expect(
      within(papers[0]).getByRole('link', { name: /open paper/i }),
    ).toHaveTextContent('FCN 2026');
    for (const paper of papers.slice(1)) {
      expect(within(paper).getByRole('link', { name: /open paper/i })).toHaveTextContent(
        'DOI',
      );
    }
  });

  it('renders four verified patent records with Long Xu emphasized', () => {
    render(<HomePage />);

    const patents = screen.getByRole('region', { name: 'Patents' });
    const records = within(patents).getAllByRole('article');
    expect(records).toHaveLength(4);

    const patentLinks = [
      'https://patents.google.com/patent/CN121368013B/en',
      'https://patents.google.com/patent/CN119938160A/en',
      'https://patents.google.com/patent/CN117880887A/en',
      'https://patents.google.com/patent/CN116209103B/en',
    ];

    expect(
      within(records[0]).getByRole('heading', {
        name: 'Data Transmission Method, Apparatus, and System',
      }),
    ).toBeVisible();
    expect(within(records[0]).getByText('Granted Chinese Invention Patent')).toBeVisible();
    expect(within(records[1]).getByText('Application No. 202411778024.X')).toBeVisible();

    records.forEach((record, index) => {
      expect(within(record).getByText('Long Xu').tagName).toBe('STRONG');
      const patentLink = within(record).getByRole('link', { name: /open patent/i });
      expect(patentLink).toHaveAttribute('href', patentLinks[index]);
      expect(patentLink).toHaveAttribute('target', '_blank');
      expect(patentLink).toHaveAttribute('rel', 'noreferrer');
    });
  });

  it('renders the verified ECE371 teaching role and course link', () => {
    render(<HomePage />);

    const teaching = screen.getByRole('region', { name: 'Teaching Experience' });
    expect(
      within(teaching).getByRole('heading', { name: 'Leading Teaching Assistant' }),
    ).toBeVisible();
    expect(
      within(teaching).getByRole('heading', {
        name: 'ECE371: Neural Network and Deep Learning',
      }),
    ).toBeVisible();
    expect(within(teaching).getByText('2024 — Present')).toBeVisible();
    expect(within(teaching).getByText('Spring 2026')).toBeVisible();
    expect(within(teaching).getByText('Instructor: Ruimao Zhang')).toBeVisible();
    expect(within(teaching).getByRole('link', { name: /open course website/i })).toHaveAttribute(
      'href',
      'http://zhangruimao.site/ECE371.html',
    );
  });

  it('orders Publications, Patents, Teaching Experience, and Education in sequence', () => {
    render(<HomePage />);

    const publications = screen.getByRole('region', { name: 'Selected Publications' });
    const patents = screen.getByRole('region', { name: 'Patents' });
    const teaching = screen.getByRole('region', { name: 'Teaching Experience' });
    const education = screen.getByRole('region', { name: 'Education' });
    expect(
      publications.compareDocumentPosition(patents) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      patents.compareDocumentPosition(teaching) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      teaching.compareDocumentPosition(education) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
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
