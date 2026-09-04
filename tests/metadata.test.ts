import { describe, expect, it } from 'vitest';
import { createSiteMetadata, siteMetadata } from '../app/site-metadata';

describe('homepage metadata', () => {
  it('describes Long Xu and uses the dedicated social preview', () => {
    expect(siteMetadata.metadataBase).toEqual(
      new URL('https://xulong66.github.io'),
    );
    expect(siteMetadata.title).toBe('Long Xu · Academic Homepage');
    expect(siteMetadata.description).toBe(
      'Long Xu is a Ph.D. candidate at Sun Yat-sen University researching edge intelligence, computation offloading, and wireless systems.',
    );
    expect(siteMetadata.openGraph).toMatchObject({
      type: 'website',
      title: 'Long Xu · Academic Homepage',
      images: [{ url: '/og.png', width: 1200, height: 630 }],
    });
    expect(siteMetadata.twitter).toMatchObject({
      card: 'summary_large_image',
      images: ['/og.png'],
    });
  });

  it('binds relative social assets to an explicit trusted deployment origin', () => {
    const metadata = createSiteMetadata('https://long-xu.example');
    const metadataBase = new URL(String(metadata.metadataBase));

    expect(metadataBase).toEqual(new URL('https://long-xu.example'));
    expect(metadataBase.hostname).not.toBe('localhost');
    expect(metadata.openGraph).toMatchObject({ images: [{ url: '/og.png' }] });
    expect(metadata.twitter).toMatchObject({ images: ['/og.png'] });
  });
});
