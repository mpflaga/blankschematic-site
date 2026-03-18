---
title: "SparkFun MP3 Player Shield Library"
date: 2012-09-22
categories: [electronics, arduino, audio]
tags: [mp3, library, maker, spi, sparkfun, vs1053]
github: "https://github.com/mpflaga/Sparkfun-MP3-Player-Shield-Arduino-Library"
cover: /images/projects/sparkfun-mp3-shield.webp
status: complete
summary: "The original non-blocking, interrupt-driven Arduino library for the SparkFun MP3 Player Shield (VS1053) — superseded by the generalized vs1053_for_SdFat library."
---

## Overview

The **SFEMP3Shield** library was the first non-blocking, interrupt-driven MP3 playback library for the SparkFun MP3 Player Shield. Built around VLSI's VS1053 audio decoder chip, it streams audio from a FAT-formatted SD card over SPI while the Arduino remains free to handle other tasks.

This was an early, widely-used library for maker audio projects starting in 2012. It has since been superseded by the more hardware-agnostic [VS1053 for SdFat](https://github.com/mpflaga/Arduino_Library-vs1053_for_SdFat) library, which is available directly from the Arduino IDE Library Manager and supports a wider range of VS1053-based shields and breakout boards.

## Supported Formats

- MP3 (primary use case)
- Ogg Vorbis, AAC, WMA, FLAC, WAV, MIDI (via VS1053 hardware)

## Hardware

Designed specifically for the **SparkFun MP3 Player Shield** (DEV-12660 and earlier revisions) stacked on an ATmega328 Arduino Uno or Duemilanove. The VS1053 chip on the shield offloads all audio decoding from the Arduino CPU.

## Migration

All active development, bug fixes, and new features have moved to [Arduino_Library-vs1053_for_SdFat](https://github.com/mpflaga/Arduino_Library-vs1053_for_SdFat). New projects should use that library.
