---
title: "Per-Device Internet Curfew with nftables + Home Assistant"
date: 2025-01-20
categories: [networking]
tags: [openwrt, nftables, home-assistant, parental-controls, firewall]
github: ""
status: complete
summary: "Blocks internet access per-device on a schedule using OpenWRT nftables rules, with a Home Assistant dashboard toggle for manual overrides — no third-party apps or cloud dependency."
---

## Overview

<!-- Fill in your build notes here -->

## Architecture

```
[HA Dashboard Toggle]
        ↓
[HA REST API → OpenWRT]
        ↓
[nftables ruleset update]
        ↓
[Device blocked / unblocked]
```

## nftables Rule

```bash
nft add rule inet filter forward \
  ether saddr AA:BB:CC:DD:EE:FF \
  time "22:00"-"06:00" drop
```

## Home Assistant Setup

<!-- Describe the toggle helper, REST command, and automation -->

## OpenWRT Config

<!-- Describe the firewall script and how HA calls it -->
