---
title: "Wiegand Keypad Garage Door — PIN Hashing in ESPHome"
date: 2024-09-01
categories: [electronics, home-assistant]
tags: [esphome, esp32, security, garage]
status: complete
cover: /images/projects/wiegand-keypad-garage.jpg
photos: "https://photos.app.goo.gl/Lmsp3eky5WeWxhQ16"
summary: "Secure garage door access via a Wiegand keypad wired to an ESP32 running ESPHome — PINs are stored as hashes in the config, never in plaintext."
---

## Overview

<!-- Fill in your build notes here -->

## Why Hashed PINs

Standard ESPHome keypad examples store PINs in plaintext in the YAML config, which ends up committed to git and visible to anyone with repo access. This build hashes PINs at config time so the secret never lives in the source.

## Hardware

<!-- List keypad model, ESP32 board, wiring -->

## ESPHome Config

<!-- Add config snippet showing hashed PIN approach -->

## Home Assistant Integration

<!-- Describe automation, access log, etc. -->
