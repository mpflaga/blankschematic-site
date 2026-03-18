---
title: "Wiegand Keypad Garage Door — Thin-Edge ESPHome Reader"
date: 2024-09-01
categories: [electronics, home-assistant]
tags: [esphome, esp32, security, garage, wiegand, rfid]
github: "https://gist.github.com/mpflaga/4e57101bfbf8f8bc80156b2886df9f1e"
status: complete
cover: /images/projects/wiegand-keypad-garage.jpg
photos: "https://photos.app.goo.gl/Lmsp3eky5WeWxhQ16"
summary: "ESPHome config for an ESP32 Wiegand keypad reader built on a thin-edge philosophy — the device only captures input and relays it to Home Assistant; all access-control logic stays in the hub."
---

## Overview

An ESPHome config for an ESP32 that acts as a Wiegand keypad reader for a garage door. The design is built around a **thin-edge philosophy** — the device's only job is to capture input and relay it upstream to Home Assistant, with no local secret storage or access-control logic on the device itself.

## How It Works

The `wiegand` component reads raw input from a Wiegand-protocol keypad (or RFID reader) connected on two GPIO pins (D0/D1), handling raw key presses, tag reads, and raw bit streams. On top of that, the `key_collector` component assembles individual key presses into a complete 4-digit PIN:

- `#` — enter / submit
- `*#` — clear / reset
- 4-second inactivity timeout

When a complete PIN is entered (or a tag is scanned), the value is published to a `text_sensor` called **Keypad Code**, which exposes it to Home Assistant. After a 500ms delay to ensure HA picks up the value, the sensor is cleared back to `"0"` to prevent duplicate processing.

That's the full extent of what the device does — collect the credential and send it.

## Design Intent

All actual logic — PIN validation, authorization decisions, door actuation — lives in **Home Assistant automations**, not on the ESP32. This approach:

- Avoids storing PINs or secrets in ESPHome firmware (where they'd sit in plaintext flash memory)
- Centralizes access control where it can be audited and changed without reflashing hardware
- Keeps the edge device simple and easily replaceable

The ESP32 CPU is clocked down to 160 MHz (from the default 240 MHz) to reduce power consumption, since the workload is minimal.

## Configuration Practices

Network config is pulled from an external `.network.yaml` include, keeping WiFi credentials separated from the main config — a clean practice for version control. Production logging is set to `INFO`, with `DEBUG`-level messages available on the key-press and raw-data handlers for troubleshooting.
