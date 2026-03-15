---
title: "Home Network VLAN Segmentation"
date: 2024-06-01
categories: [networking]
tags: [vlan, openwrt, switch, home-assistant, iot]
github: ""
status: complete
summary: "Home network segmented into VLANs — IoT devices, trusted clients, and guest traffic isolated on separate subnets with OpenWRT firewall rules between them."
---

## Overview

<!-- Fill in your build notes here -->

## VLAN Layout

| VLAN | Name | Devices |
|------|------|---------|
| 1 | Trusted | PCs, phones |
| 10 | IoT | ESPHome, smart bulbs, cameras |
| 20 | Guest | Guest Wi-Fi |

## Switch Config

<!-- Describe managed switch config, tagged/untagged ports -->

## OpenWRT Firewall Rules

<!-- Describe inter-VLAN rules — what IoT can/can't reach -->

## Home Assistant Placement

<!-- Which VLAN, how it reaches IoT devices -->
