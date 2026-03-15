---
title: "Arduino PhotoCell Array Averaged Library"
date: 2022-01-30
categories: [electronics, arduino]
tags: [arduino, library, sensors, analog, photocell, ldr, maker]
github: "https://gist.github.com/mpflaga/91e45f9539b6cd1ebc58fedae70eb33c"
status: complete
summary: "Arduino library for reading an array of photocell (LDR) sensors with a sliding-window moving average and configurable threshold detection — supports multiple sensors with individual sample rates."
---

## Overview

A full Arduino library for managing an array of photocell (light-dependent resistor) sensors. Each sensor in the array maintains an independent sliding-window moving average, making readings stable and noise-resistant.

## Features

- **Array of sensors** — manage multiple LDRs with a single object
- **Sliding-window moving average** — configurable window size per sensor smooths out noise
- **Threshold detection** — each sensor reports a binary above/below-threshold status
- **Pin pair wiring** — each sensor uses a `signal` pin and a `ground` pin (no shared ground resistor needed — the Arduino drives the ground pin LOW)
- **Dynamic allocation** — sensor array size set at construction, proper destructor

## Usage

```cpp
#include "PhotCellArrayAveraged.h"

// 4 sensors, each averaged over 10 samples
PhotoCell ldr[] = {
  {Pins{A0, A1}, 10},
  {Pins{A2, A3}, 10},
  {Pins{A4, A5}, 10},
  {Pins{A6, A7}, 10}
};

void loop() {
  for (int i = 0; i < 4; i++) {
    ldr[i].update();
    Serial.print(ldr[i].average());
    Serial.print("(");
    Serial.print(ldr[i].thresholdStatus());
    Serial.print(") ");
  }
  Serial.println();
  delay(1000);
}
```

## Wiring

Each sensor uses two analog pins — one driven LOW as a virtual ground, one read as the signal. This avoids needing a resistor to ground on each sensor and makes wiring a large array cleaner.

```
Arduino pin (signal) ─── [Photocell] ─┬─── [10kΩ] ─── Arduino pin (ground, driven LOW)
                                       │
                                    (read ADC)
```

## Pin Pair Approach

Driving the ground pin LOW from the Arduino instead of using a shared PCB ground trace means each sensor is fully self-contained on two adjacent analog pins. No breadboard jumpers or separate resistors — just the photocell and a resistor between two pins.
