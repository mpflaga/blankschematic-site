---
title: "MicroPython Giant Calculator"
date: 2025-12-27
categories: [electronics, micropython]
tags: [micropython, neopixel, maker, calculator, esp32, raspberry-pi-pico]
github: "https://github.com/mpflaga/Mega_Calculator_MicroPython"
status: in-progress
summary: "MicroPython rewrite of the Impression 5 giant calculator — 9-digit NeoPixel 7-segment display with 20 physical buttons, running on ESP32 or Raspberry Pi Pico."
---

## Overview

This is a MicroPython port of the [Impression 5 Giant Calculator](https://github.com/mpflaga/Impression5-Mega_Calculator-Arduino) Arduino project. Where the original used C++ with specialized Arduino libraries and big-integer arithmetic, this version uses native Python features and object-oriented design on modern MicroPython-compatible hardware.

## Hardware

- **MicroPython board** — ESP32 or Raspberry Pi Pico (configurable)
- **261 NeoPixel LEDs** — arranged in a 7-segment format to form a 9-digit display
- **20 push buttons** — numeric keys (0–9), operators, equals, and clear

The NeoPixel 7-segment approach means the display can show any color per segment — useful for status indications, highlighting input, or adding visual flair beyond what fixed-segment LED modules allow.

## Architecture

The codebase is split into modules to separate concerns:

- `display.py` — NeoPixel segment mapping and digit rendering
- `calculator.py` — arithmetic state machine (operands, operators, result)
- `buttons.py` — GPIO input handling
- `config.py` — pin assignments and display layout parameters (customize here for your hardware)

## Testing Without Hardware

A **serial console mode** lets you test the calculator logic via terminal without any physical buttons or LEDs connected. Input is typed on a keyboard; output is printed as text. Useful for verifying arithmetic behavior before committing to hardware assembly.

## Key Difference from Arduino Version

The Arduino version uses a C++ big-integer library (`BigNumber`) to support arbitrary precision — important for an exhibit where visitors type very long numbers. The MicroPython version relies on Python floats, which limits precision to approximately 15–17 significant digits. This is a known trade-off; Python's `decimal` module could be used to restore arbitrary precision if needed.

## Installation

Deploy files to the board using `ampy` or the Thonny IDE. Edit `config.py` to match your pin assignments before uploading.
