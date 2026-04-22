import type { Graph } from 'schema-dts'

export const siteConfig = {
  title: "Chat | Nathan's AI",
  name: 'Chat',
  description: 'A personal AI that knows you well enough to get it right.',
  url: 'https://chat.brodin.dev',
  og: 'https://chat.brodin.dev/og.png',
  authorUrl: 'https://brodin.dev',
  twitterHandle: '@nathan_brodin',
  githubHandle: 'NathanBrodin',
  keywords: [
    'Nathan Brodin',
    'Chat',
    "Nathan's AI",
    'personal AI chatbot',
    'AI assistant',
    'AI with context',
    'OpenRouter chatbot',
    'personal AI',
    'everyday AI assistant',
  ],
}

export const siteJsonLd: Graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://brodin.dev/#person',
      name: 'Nathan Brodin',
      url: 'https://brodin.dev',
      image: 'https://brodin.dev/og.png',
      jobTitle: 'Frontend Engineer',
      description:
        'A frontend engineer with a passion for web development, design, and user experience.',
      sameAs: [
        'https://github.com/NathanBrodin',
        'https://linkedin.com/in/nathan-brodin',
        'https://twitter.com/nathan_brodin',
        'https://medium.com/@nathan-brodin',
        'https://dev.to/nathan-brodin',
        'https://peerlist.io/brodin',
        'https://www.figma.com/@nathanbrodin',
      ],
      knowsAbout: ['TypeScript', 'React', 'Next.js', 'TanStack', 'Tailwind CSS'],
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'ESIEA Graduate School of Engineering',
        sameAs: 'https://www.esiea.fr/',
      },
      worksFor: {
        '@type': 'Organization',
        name: 'Capia AS',
        sameAs: 'https://capia.no/',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Tromso',
        addressCountry: 'NO',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://chat.brodin.dev/#website',
      name: "Chat | Nathan's AI",
      url: 'https://chat.brodin.dev',
      description: 'A personal AI that knows you well enough to get it right.',
      inLanguage: 'en-US',
      author: {
        '@id': 'https://brodin.dev/#person',
      },
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://chat.brodin.dev/#app',
      name: "Chat | Nathan's AI",
      url: 'https://chat.brodin.dev',
      description: 'A personal AI that knows you well enough to get it right.',
      inLanguage: 'en-US',
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Web',
      sameAs: 'https://github.com/NathanBrodin/Chat',
      image: 'https://chat.brodin.dev/og.png',
      isPartOf: {
        '@id': 'https://chat.brodin.dev/#website',
      },
      author: {
        '@id': 'https://brodin.dev/#person',
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  ],
}
