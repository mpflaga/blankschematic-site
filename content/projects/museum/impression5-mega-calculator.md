---
title: "Impression 5 Giant Calculator"
date: 2020-03-05
categories: [museum, electronics, arduino]
tags: [arduino, led, calculator, maker, lmn, impression5]
github: "https://github.com/mpflaga/Impression5-Mega_Calculator-Arduino"
status: complete
summary: "Arduino Mega replacement for Impression 5 Science Center's giant calculator exhibit — custom LED display and keypad controller using big-number arithmetic."
---

## Overview

The [Impression 5 Science Center](https://impression5.org) in Lansing, MI operates an oversized calculator exhibit that lets visitors perform arithmetic on a human-scale input panel. This project is the Arduino Mega–based electronics replacement for that exhibit's controller.

The original display electronics wore out and needed a from-scratch reimplementation. The new controller drives a custom LED display panel, reads a physical keypad, and handles big-number arithmetic — necessary because exhibit visitors happily type 15-digit numbers and expect correct results.

## Architecture

The firmware is split into focused modules:

- **`LEDdisplay`** — drives the multi-digit LED display, mapping digits to segment outputs
- **`Calculator`** — arithmetic engine; handles addition, subtraction, multiplication, and division
- **`BigNumber`** — arbitrary-precision number representation (wraps a C big-integer library) so the display never overflows silently
- **`Mega_Calculator.ino`** — top-level sketch wiring it all together

## Hardware

- **Arduino Mega 2560** — needed for the I/O count (keypad rows/columns + multiple display driver pins)
- **LED 7-segment displays** — driven via the custom `LEDdisplay` module
- **Physical keypad** — numeric digits 0–9, operators (+, −, ×, ÷), equals, clear

## Companion PCB

The **[SMASH Shield](https://github.com/mpflaga/Impression5-SMASH-Shield-Eagle)** is the Eagle CAD Arduino Mega shield PCB designed for this and other Impression 5 projects, providing standardized connectors for display panels, keypad wiring, and power.

## Related Projects

This project is part of a family of Lansing Makers Network contributions to Impression 5, alongside the [Genome Map](https://github.com/mpflaga/Impression5-GenomeMap-Arduino) interactive exhibit.
