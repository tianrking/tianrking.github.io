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



