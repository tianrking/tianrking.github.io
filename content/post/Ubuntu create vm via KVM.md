---
title: "Ubuntu Create Vm via KVM_"
date: 2022-05-22T20:02:34+08:00
draft: false
---



sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils

sudo adduser ‘username’ libvirt //root

sudo adduser ‘[username]’ kvm

virsh list --all

sudo systemctl status libvirtd

sudo systemctl enable --now libvirtd

sudo apt install virt-manager




virt-install --option1=value --option2=value ...