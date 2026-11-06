import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from '../app/page';

describe('academic homepage hero', () => {
  it('identifies Long Xu and his current research role in the first view', () => {
    render(<HomePage />);

    const about = screen.getByRole('region', { name: /Long Xu/i });
    expect(within(about).getByRole('heading', { level: 1, name: /Long Xu/i })).toBeVisible();
    expect(within(about).queryByText('徐龙')).not.toBeInTheDocument();
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
    expect(within(about).getByRole('link', { name: /supervisor/i })).toHaveAttribute(
      'href',
      'https://sece.sysu.edu.cn/szll/js/rztx/1399313.htm',
    );
  });

  it('uses the approved front-facing portrait with descriptive text', () => {
    render(<HomePage />);

    expect(screen.getByRole('img', { name: /portrait of long xu/i })).toHaveAttribute(
      'src',
      '/long-xu-portrait.png',
    );
  });

  it('previews a single signal path and restores the pinned edge node when the pointer leaves', () => {
    render(<HomePage />);
    const diagram = screen.getByRole('region', { name: 'Edge AI signal paths' });
    const controls = within(diagram);
    const sensors = controls.getByRole('button', { name: 'Sensors' });
    const edge = controls.getByRole('button', { name: 'Edge AI' });
    const detail = controls.getByRole('status');

    fireEvent.click(edge);
    expect(edge).toHaveAttribute('aria-pressed', 'true');
    expect(diagram.querySelectorAll('path[data-active="true"]')).toHaveLength(3);
    expect(detail).toHaveTextContent('Processes incoming data near its source');

    fireEvent.pointerEnter(sensors, { pointerType: 'mouse' });
    expect(diagram.querySelectorAll('path[data-active="true"]')).toHaveLength(1);
    expect(detail).toHaveTextContent('Capture signals from the physical world');

    fireEvent.pointerLeave(sensors, { pointerType: 'mouse' });
    expect(detail).toHaveTextContent('Processes incoming data near its source');
    fireEvent.keyDown(edge, { key: 'Escape' });
    expect(edge).toHaveAttribute('aria-pressed', 'false');
    expect(diagram.querySelectorAll('path[data-active="true"]')).toHaveLength(0);
  });
});
