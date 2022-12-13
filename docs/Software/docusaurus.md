---
description: terminator
title: terminator
tags:
  - docusaurus
  - blog
keywords:
  - docusaurus
  - blog
image: https://github.com/tianrking.png
last_update:
  date: 12/13/2022
  author: w0x7ce
---

## Struct

```bash
my-website         // Root
├── blog           // Blog Root  We dont use now 
│   ├── 2019-05-28-hola.md
├── docs           // Wiki docs
│   ├── doc1.md
│   ├── doc2.md
│   ├── doc3.md
│   └── mdx.md
├── src
│   ├── css        // style manager
│   │   └── custom.css
│   └── pages      // page manager
│       ├── styles.module.css
│       └── index.js
├── static        // static common file 
│   └── img
├── docusaurus.config.js  // docusaurus base config
├── package.json
├── README.md
├── sidebars.js           // sidebar config
└── yarn.lock
```

## Local install

1. Download nodejs latest from [https://nodejs.org/en/download](https://nodejs.org/en/download/) 

2. Add to $PATH 
    
    ```bash
    export PATH=$PATH/{YOUR DOWNLOAD PATH}/bin
    ```

3. Install Yarn via 

    ```bash
    npm install yarn -g
    ```

4. Install Default dependence

    ```bash
    yarn 
    ```

5. Simply run blog

    ```bash
    yarn start
    ```

## Add new article

1. Create your markdown file in docs , if your file named "test.md" 

    ```bash
    touch /docs/test.md
    ```

    In order to achieve classification purposes, new folders can be created when necessary, in /docs

    ```bash
    touch /docs/type_A/test.md
    ```

2. Write code & article

    We are supposed to change value in {value} .

    ```markdown

      ---
      description: {example}
      title: {example}
      tags:
        - {tag1}
        - {tag2}
        - {tag3}
      keywords:
        - {tag1}
        - {tag2}
        - {tag3}
      image: {https://github.com/tianrking.png}
      last_update:
        date: {12/6/2022}
        author: {w0x7ce}
      ---

      ## P1
      ## P2

    ```

3. Test code 

    ```bash
    yarn start
    ```

4. Build Website

    ```bash
    yarn build
    ```

5. Develop to Github & Server

    ```bash
    git add .
    git commit -m {message}
    git push -u {remote} {branch}
    ```

## Github Maintenance

1. Generating a new SSH key & Make sure SSH key exist

    ```bash
    ssh-keygen -t ed25519 -C "your_email@example.com"
    ```

  - Public key
    
    ```bash
    cat ~/.ssh/{id_ed25519.pub}
    ```
  
  - Private key

    ```bash
    cat ~/.ssh/{id_ed25519}
    ```

2. Add your Public key in [Github Personal Keys](https://github.com/settings/keys)
   
    Click -> {New SSH key} -> Paste {Public key}

3. Add your Private Key in [Repo Secrets For Actions] for Github Actions

    Click {New repository secret} -> Paste {Private key}

    https://github.com/{USER}/{REPO}/settings/secrets/actions


## Search Support

```bash
docker run -it --env-file=.env -e "CONFIG=$(cat docsearch.json | jq -r tostring)" algolia/docsearch-scraper
```

```json title="docsearch.json"
{
  "index_name": "wiki",
  "start_urls": [
    "https://c1ev0ps.github.io/docusaurus_wiki/"
  ],
  "sitemap_urls": [
    "https://c1ev0ps.github.io/docusaurus_wiki/sitemap.xml"
  ],
  "stop_urls": [
    "/search",
    "/v3me",
    "/playground",
    "/inspector"
  ],
  "sitemap_alternate_links": true,
  "selectors": {
    "lvl0": {
      "selector": "(//ul[contains(@class,'menu__list')]//a[contains(@class, 'menu__link menu__link--sublist menu__link--active')]/text() | //nav[contains(@class, 'navbar')]//a[contains(@class, 'navbar__link--active')]/text())[last()]",
      "type": "xpath",
      "global": true,
      "default_value": "Documentation"
    },
    "lvl1": "header h1",
    "lvl2": "article h2",
    "lvl3": "article h3",
    "lvl4": "article h4",
    "lvl5": "article h5, article td:first-child",
    "lvl6": "article h6",
    "text": "article p, article li, article td:last-child"
  },
  "strip_chars": " .,;:#",
  "custom_settings": {
    "separatorsToIndex": "_",
    "attributesForFaceting": [
      "language",
      "version",
      "type",
      "docusaurus_tag"
    ],
    "attributesToRetrieve": [
      "hierarchy",
      "content",
      "anchor",
      "url",
      "url_without_anchor",
      "type"
    ]
  },
  "js_render": true,
  "nb_hits": 856
}

```

```bash title=".env"
APPLICATION_ID={Application ID}
API_KEY={Admin API Key}
```

```bash title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    algolia: {
      // Application ID
      appId: {'YOUR_APP_ID'},
      //  Search-Only API Key
      apiKey: {'YOUR_SEARCH_API_KEY'},
      indexName: {'YOUR_INDEX_NAME'}
    }
  }
};
```


We can get {Application ID} & {Admin API Key} [here](https://www.algolia.com/account/api-keys)


