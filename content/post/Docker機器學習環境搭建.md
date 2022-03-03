---
title: "Docker機器學習環境搭建"
date: 2022-03-03T17:21:04+08:00
draft: false

tags: ["Linux","Docker"]
categories: ["軟件"]
author: "w0x7ce"
---

## Way 1 simple use ufoym/deepo

 [https://github.com/ufoym/deepo](https://github.com/ufoym/deepo)
 [https://hub.docker.com/r/ufoym/deepo](https://hub.docker.com/r/ufoym/deepo)

### Configure Docker

#### Step 1 Uninstall old version

```bash
 sudo apt-get remove docker docker-engine docker.io containerd runc
```

#### Step 2 Install latest docker

```bash
 sudo apt-get update
 sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

```bash
 sudo apt-get update
 sudo apt-get install docker-ce docker-ce-cli containerd.io
```

#### Step 3 Install nvidia-docker

1. Setting up NVIDIA Container Toolkit

    ```bash
    distribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
    && curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add - \
    && curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
    ```

2. To get access to experimental features such as CUDA on WSL or the new MIG capability on A100

    ```bash
    curl -s -L https://nvidia.github.io/nvidia-container-runtime/experimental/$distribution/nvidia-container-runtime.list | sudo tee /etc/apt/sources.list.d/nvidia-container-runtime.list
    ```

3. Install the nvidia-docker2

    ```bash
    sudo apt update
    sudo apt-get install -y nvidia-docker2
    ```

4. Final restart

    ```bash
    sudo systemctl restart docker
    ```

#### Step 4 Select the verion depends on ur ENV

```bash
    nvidia-smi #view the cuda version if it's cuda10.2
    docker pull ufoym/deepo:pytorch-cu102
    nvidia-docker  run --name w0x7ce -p 7789:22 -p 7791:7790 -it -v /storage/xpq:/data ufoym/deepo:pytorch-cu102
```

NOW it will work well !

#### USE note

docker start [tag]
docker attach [tag]
ctrl +p + q ## exit without stop the container
docker ps -a
