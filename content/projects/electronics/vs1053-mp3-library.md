---
title: "VS1053 Arduino MP3 Library"
date: 2017-06-04
categories: [electronics, arduino, audio]
tags: [arduino, audio, mp3, library, maker, spi, vs1053]
github: "https://github.com/mpflaga/Arduino_Library-vs1053_for_SdFat"
docs: "https://mpflaga.github.io/Arduino_Library-vs1053_for_SdFat/"
status: complete
summary: "Non-blocking, interrupt-driven Arduino library for the VLSI VS1053 audio decoder chip — streams MP3, AAC, Ogg Vorbis, FLAC, WMA, and WAV from SD card over SPI."
---

## Overview

The **VS1053 for SdFat** library drives VLSI's VS1053 audio decoder chip from an Arduino over SPI. It is real-time, non-blocking, and interrupt-driven — meaning audio plays in the background while your sketch continues to run, rather than blocking in a `delay()` loop waiting for the chip.

The VS1053 handles the heavy lifting of decoding compressed audio. Feed it a bitstream from an SD card and it outputs line-level stereo audio directly — no DSP math required on the Arduino side.

## Supported Audio Formats

- MP3
- Ogg Vorbis
- AAC / HE-AAC
- WMA
- FLAC
- WAV / PCM
- MIDI

## Supported Hardware

Initially developed on an ATmega328 (Uno/Duemilanove) with a SparkFun MP3 Player Shield. Additional board support covers:

- Arduino Mega (ATmega2560)
- Seeeduino MP3 Player Shield
- Custom VS1053 breakout boards via configurable pin assignments

The library is modular — pin assignments and SPI parameters are defined in a configuration header, making it straightforward to port to other Arduino-compatible platforms.

## Why Non-Blocking Matters

Most audio playback examples use blocking code: read a chunk, send it, wait, repeat. This prevents the sketch from doing anything else — no button checking, no display updates, nothing — while audio plays. This library uses a data-request interrupt from the VS1053's DREQ pin to trigger SPI transfers only when the chip is ready, leaving the CPU free for the rest of your application.

## Documentation

Full Doxygen-generated API documentation is hosted at the [GitHub project page](https://mpflaga.github.io/Arduino_Library-vs1053_for_SdFat/).

## Installation

Available directly from the **Arduino IDE Library Manager** — search for **VS1053 for use with SdFat**.

## History

This library supersedes the original [Sparkfun MP3 Player Shield Arduino Library](https://github.com/mpflaga/Sparkfun-MP3-Player-Shield-Arduino-Library), which was tied specifically to the SparkFun shield hardware. The vs1053_for_SdFat version generalizes the hardware interface while preserving the same non-blocking architecture.
