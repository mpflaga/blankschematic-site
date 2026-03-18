---
title: "ESPHome Network & API Watchdog — Auto Power-Cycle with SONOFF S31"
date: 2023-12-11
categories: [electronics, networking, home-assistant]
tags: [esphome, sonoff, iot, watchdog]
github: "https://gist.github.com/mpflaga/9bc5586a42d191477e4ba077c710f765"
github2: "https://gist.github.com/mpflaga/122e71bd98a08bac979af1131cce5680"
github2label: "github (api watchdog) ↗"
cover: /images/projects/esphome-power-cycle-watchdog.webp
status: complete
summary: "Two ESPHome configs for a SONOFF S31 smart plug that auto power-cycles a device when it stops responding — one using ICMP ping loss detection, one using Home Assistant API connection loss."
---

## Overview

Sometimes devices lock up and need a power cycle. Rather than get up and unplug something, these two ESPHome configurations turn a cheap **SONOFF S31** smart plug into an intelligent watchdog that does it automatically.

Two approaches to detecting the same problem — pick whichever fits your situation:

---

## Approach 1 — Ping Watchdog

**[Gist](https://gist.github.com/mpflaga/9bc5586a42d191477e4ba077c710f765)**

Pings a target IP address every 60 seconds. After `ping_loss_threshold` (default: 3) consecutive minutes of 100% packet loss, it power-cycles the relay. A `ping_hold_off` timer (default: 5 minutes) prevents it from re-triggering immediately after a cycle.

```yaml
substitutions:
  target_ip_address: "192.168.20.121"
  ping_loss_threshold: "3"
  ping_hold_off: "5"
```

**Best for:** Monitoring a device that should always respond to ping — a NAS, router, server, or network switch. The monitored device doesn't need to run ESPHome or Home Assistant.

**How it works:** Uses the `AsyncPing` external component. A signed int global tracks consecutive failures. When threshold is crossed: relay off → delay → relay on. The manual button on the S31 also triggers a power cycle.

---

## Approach 2 — Home Assistant API Watchdog

**[Gist](https://gist.github.com/mpflaga/122e71bd98a08bac979af1131cce5680)**

Uses ESPHome's native `api.reboot_timeout`. If the ESPHome device loses connection to the Home Assistant API for longer than the threshold, it cycles the relay.

```yaml
substitutions:
  api_loss_threshold: "17min"
```

**Best for:** Monitoring a device that runs ESPHome — if HA can't reach the device's API, it likely needs a power cycle. Also useful for monitoring the HA server itself (the watchdog plug is independent and will cycle the HA host if it stops responding).

**On boot behavior:** Relay cycles off/on at startup (`restore_mode: ALWAYS_OFF`) to clear any hung state.

---

## Shared Infrastructure

Both configs use a common reusable `.network.yaml` package providing:

- WiFi with AP fallback + captive portal
- Web server (port 80) with authentication
- Home Assistant API with encryption
- OTA updates
- WiFi signal strength + uptime sensors
- Restart button
- SNTP time sync
- Auto-reboot if WiFi is lost for 15 minutes

The composable package approach (`packages: !include`) keeps each config DRY — board-specific settings, network config, and watchdog logic are each in their own file.

---

## Hardware

**SONOFF S31** — an ESP8266-based smart plug. Flashed with ESPHome via serial (one-time, before sealing the case). Subsequent updates via OTA. Available for ~$10–15.
