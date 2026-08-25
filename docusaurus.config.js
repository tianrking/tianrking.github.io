// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import clsx from 'clsx';
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'w0x7ce',
  tagline: '嵌入式系統、Local AI 與基礎設施筆記',
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

  // Keep browser state isolated when the site is embedded beside another app
  // on the same origin (for example, during local development or previews).
  storage: {
    type: 'localStorage',
    namespace: true,
  },

  // Docusaurus Faster is stable in 3.10.2. Keep the v4 breaking-change flags
  // opt-in while using the faster compiler/bundler on this v3 site. SSG worker
  // threads remain disabled because that option requires the v4 post-build
  // head migration; the other compiler and bundler improvements are safe here.
  future: {
    faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      mdxCrossCompilerCache: true,
      rspackBundler: true,
      rspackPersistentCache: true,
      ssgWorkerThreads: false,
      gitEagerVcs: true,
    },
  },

  // Add scripts to all pages
  scripts: [
    {
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8741919641227561',
      async: true,
      crossorigin: 'anonymous',
    },
  ],

  markdown: {
    mermaid: true,
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
          // Historical imported notes intentionally use a broad inline-tag
          // vocabulary. The canonical docs/tags.yml covers the maintained
          // taxonomy; unknown legacy tags remain searchable without flooding
          // production builds with non-actionable warnings.
          onInlineTags: 'ignore',
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
            ],
            to: '/embedded/telink/tlsr8258/sws-build-flash-verify',
          },
        ],
      },
    ],
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['zh', 'en'],
        indexDocs: true,
        indexBlog: true,
        indexPages: false,
        // The imported WeChat archive remains available on its canonical pages
        // and in /explore, but should not make the global Lunr payload enormous.
        // Those files use the stable export suffix `-224748<id>`; maintained
        // notes (including the BLE and Telink articles) are indexed normally.
        ignoreFiles: /^blog\/\d{4}-\d{2}-\d{2}-.*-224748\d+$/,
        docsRouteBasePath: '/',
        blogRouteBasePath: '/blog',
        searchBarShortcutKeymap: 'mod+k',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 10,
        searchResultContextMaxLength: 90,
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
          // Keep the first navigation level visible so the docs landing page
          // does not look empty. Nested topic groups remain opt-in collapsed.
          autoCollapseCategories: false,
        },
      },
      image: 'img/w0x7ce-social-card.png',
      navbar: {
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
          {to: '/explore', label: '探索', position: 'left'},
          {to: '/projects', label: '專案', position: 'left'},
          {to: '/databases', label: '資料庫', position: 'left'},
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
              {
                label: '探索',
                to: '/explore',
              },
              {
                label: '全站內容索引',
                to: '/explore/library',
              },
              {
                label: '智能硬件資料庫',
                to: '/databases',
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
              {
                label: 'Email',
                href: 'mailto:tian.r.king@gmail.com',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} w0x7ce.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;


