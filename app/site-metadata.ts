import type { Metadata } from 'next';

export function createSiteMetadata(siteOrigin?: string): Metadata {
  const metadataBase = siteOrigin ? new URL(siteOrigin) : undefined;
  if (metadataBase && metadataBase.protocol !== 'https:') {
    throw new Error('NEXT_PUBLIC_SITE_URL must use HTTPS.');
  }

  return {
    ...(metadataBase ? { metadataBase } : {}),
    title: 'Long Xu (徐龙) · Academic Homepage',
    description:
      'Long Xu is a Ph.D. candidate at Sun Yat-sen University researching edge intelligence, computation offloading, and wireless systems.',
    authors: [{ name: 'Long Xu' }],
    creator: 'Long Xu',
    keywords: [
      'Long Xu',
      'edge intelligence',
      'computation offloading',
      'multi-agent reinforcement learning',
      'wireless systems',
    ],
    openGraph: {
      type: 'website',
      title: 'Long Xu (徐龙) · Academic Homepage',
      description:
        'Research in edge intelligence, computation offloading, and wireless systems.',
      siteName: 'Long Xu · Academic Homepage',
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: 'Long Xu — Edge Intelligence & Wireless Systems',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Long Xu (徐龙) · Academic Homepage',
      description:
        'Research in edge intelligence, computation offloading, and wireless systems.',
      images: ['/og.png'],
    },
  };
}

export const siteMetadata = createSiteMetadata('https://xulong66.github.io');
