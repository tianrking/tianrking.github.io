// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import clsx from 'clsx';
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '🌵 El Jardín Secreto 🌵 ',
  tagline: '✍️ Escribo, 💻 Comparto, 🌴 Vivo, 🔍 Exploro, 🎨 Creo, 💭 Pienso ✨ de w0x7ce',
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

  // onBrokenLinks: 'throw',
  onBrokenLinks: 'ignore',

  // Add scripts to all pages
  scripts: [
    {
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8741919641227561',
      async: true,
      crossorigin: 'anonymous',
    },
  ],

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Single language site (English)
  // Content can be in any language (Chinese, Spanish, English) as per MD files
  // The site interface is in English

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
            'https://github.com/tianrking/tianrking.github.io/tree/V3.9/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/tianrking/tianrking.github.io/tree/V3.9/',
          onInlineAuthors: 'ignore',
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        
      }),
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
        title: '🌵 El Jardín Secreto 🌵',
        logo: {
          alt: 'Logo de El Jardín Secreto',
          src: 'https://github.com/tianrking.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorial',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/tools', label: 'Tools', position: 'left'},
          {
            type: 'dropdown',
            label: 'Labs',
            position: 'left',
            items: [
              {to: '/ai-lab', label: '🤖 AI Lab'},
              {to: '/robotics-lab', label: '🤖 Robotics Lab'},
              {to: '/ops-lab', label: '⚙️ Ops Lab'},
            ],
          },
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
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/tianrking/tianrking.github.io',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} w0x7ce. Thanks @meta`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;


