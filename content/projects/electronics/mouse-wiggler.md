---
title: "MouseWiggler — Light-Activated Anti-Screensaver"
date: 2021-10-21
categories: [electronics]
tags: [arduino, maker, photocell, hid, usb]
github: "https://github.com/mpflaga/MouseWiggler"
cover: /images/projects/mouse-wiggler.webp
status: complete
summary: "Arduino Micro Pro HID device that prevents screensavers when room lights are on — uses a dual-criteria light-change algorithm to distinguish light switches from gradual daylight changes."
---

## Overview

MouseWiggler is a hardware screensaver suppressor. Plug it into a USB port and it periodically moves the mouse cursor by ±1 pixel — imperceptible to the user, but enough to reset the screensaver timer. What makes it smarter than a simple timer: it only wiggles when the room lights are on.

A photocell sensor detects ambient light. When you flip on the lights, wiggling starts. When you turn them off, it stops and lets the screensaver activate. The tricky part: distinguishing an intentional light switch from gradual changes like sunrise, sunset, or clouds passing overhead.

## The Dual-Criteria Algorithm

A naive implementation would trigger on any light change, which means sunrise would disable your screensaver and clouds would re-enable it throughout the day. This design uses two simultaneous criteria that must both be satisfied before toggling:

1. **Magnitude** — the immediate percentage change from the previous measurement must exceed 15%
2. **Rate of change** — the velocity of change over a 5-second rolling history window must exceed 5% per sample period

A light switch produces a sudden, fast change — both criteria trip simultaneously. Sunrise produces a gradual change — magnitude may eventually cross the threshold, but rate of change stays low. The result is that only deliberate, human-speed light switches trigger the behavior change.

## Hardware

- **Arduino Micro Pro** (ATmega32U4) — required for native USB HID support; presents as a USB mouse to the host
- **CDS Photocell** (LDR) — wired between A1 (VCC) and A0 (sense), with a 2.2kΩ pull-down to D15 (GND)
- **Optional LED** — on D2 via a 220Ω resistor; lights when wiggling is active

## Configuration

```cpp
#define SUDDEN_CHANGE_THRESHOLD  15   // % change to qualify as "sudden"
#define CHANGE_RATE_THRESHOLD     5   // % per sample period for rate gate
#define wigglePeriod             10   // seconds between wiggles (base)
#define wigglePeriodVariation     3   // ±seconds random variation
```

The random variation in wiggle timing is intentional — uniform timing patterns can be detected by monitoring software. Randomizing the interval makes the wiggle pattern statistically indistinguishable from natural mouse movement.

## Required Libraries

- TimerOne
- TimerThree
- Mouse (built-in for ATmega32U4 HID boards)
