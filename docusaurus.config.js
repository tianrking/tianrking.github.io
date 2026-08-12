// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import clsx from 'clsx';
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'w0x7ce — 技術工作台',
  tagline: '嵌入式系統、Local AI 與基礎設施的實作紀錄',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://w0x7ce.eu',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'tianrking', // Usually your GitHub org/user name.
  projectName: 'tianrking.github.io', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'throw',

  // Add scripts to all pages
  scripts: [
    {
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8741919641227561',
      async: true,
      crossorigin: 'anonymous',
    },
  ],

  markdown: {
    // Keep all content on native MDX syntax instead of the legacy MDX 1
    // compatibility preprocessor that Docusaurus v4 will remove by default.
    mdx1Compat: {
      comments: false,
      admonitions: false,
      headingIds: false,
    },
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  // The interface uses Traditional Chinese while individual technical notes may
  // retain the language that best fits their source material.
  i18n: {
    defaultLocale: 'zh-Hant',
    locales: ['zh-Hant'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({

        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          showLastUpdateTime: true,
          editUrl:
            'https://github.com/tianrking/tianrking.github.io/tree/V3.10.2/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/tianrking/tianrking.github.io/tree/V3.10.2/',
          onInlineAuthors: 'ignore',
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-54QBN2XYB9',
          anonymizeIP: true,
        },
        
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/blog/telink-tlsr8258-firmware-development-guide',
            to: '/embedded/telink/tlsr8258/sws-build-flash-verify',
          },
          {from: '/devbox', to: '/labs'},
          {from: '/tools', to: '/labs'},
          {from: '/ai-lab', to: '/labs'},
          {from: '/robotics-lab', to: '/labs'},
          {from: '/ops-lab', to: '/labs'},
          {from: '/external-lab', to: '/projects'},
          {from: '/markdown-page', to: '/'},
          {from: '/index.zh-hk', to: '/'},
          {from: '/intro', to: '/tutorial'},
          {from: '/tutorial-basics', to: '/tutorial'},
          {from: '/tutorial-basics/congratulations', to: '/tutorial'},
          {from: '/tutorial-basics/create-a-blog-post', to: '/blog'},
          {from: '/tutorial-basics/create-a-document', to: '/tutorial'},
          {from: '/tutorial-basics/create-a-page', to: '/'},
          {from: '/tutorial-basics/deploy-your-site', to: '/tutorial'},
          {from: '/tutorial-basics/markdown-features', to: '/tutorial'},
          {from: '/tutorial-extras', to: '/tutorial'},
          {from: '/tutorial-extras/manage-docs-versions', to: '/tutorial'},
          {from: '/tutorial-extras/translate-your-site', to: '/tutorial'},
          {
            from: [
              '/blog/tags/telink',
              '/blog/tags/tlsr8258',
              '/blog/tags/bluetooth-low-energy',
              '/blog/tags/embedded-systems',
            ],
            to: '/embedded/telink/tlsr8258/sws-build-flash-verify',
          },
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        hideOnScroll: true,
        style: 'dark',
        title: 'w0x7ce',
        logo: {
          alt: 'w0x7ce',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: '技術筆記',
          },
          {to: '/blog', label: '開發誌', position: 'left'},
          {to: '/projects', label: '專案', position: 'left'},
          {to: '/labs', label: '實驗場', position: 'left'},
          {
            href: 'https://github.com/tianrking',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '技術內容',
            items: [
              {
                label: '技術筆記',
                to: '/tutorial',
              },
              {
                label: '開發誌',
                to: '/blog',
              },
            ],
          },
          {
            title: '探索',
            items: [
              {
                label: '專案',
                to: '/projects',
              },
              {
                label: '實驗場',
                to: '/labs',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/tianrking/tianrking.github.io',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} w0x7ce. 寫下親手建造與驗證的系統。`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;


