---
title: "Furnace Monitor — Differential Pressure + Blink Code Detection"
date: 2024-11-15
categories: [electronics, home-assistant]
tags: [esphome, esp32, kicad, home-assistant, pcb]
github: ""
status: complete
summary: "ESP32 ESPHome device that monitors a Carrier furnace — reads a differential pressure sensor for filter restriction and a phototransistor to decode blink error codes from the status LED."
---

## Overview

<!-- Fill in your build notes here -->

## Hardware

| Component | Part | Notes |
|-----------|------|-------|
| MCU | ESP32 | |
| Pressure sensor | MPX10DP | Differential pressure, filter restriction |
| Phototransistor | TEPT4400 | Reads furnace status LED blink codes |

## Schematic

<!-- Add KiCad schematic image or link -->

## ESPHome Config

<!-- Add config snippet -->

## Home Assistant Integration

<!-- Describe dashboard, alerts, etc. -->
