---
title: "Arduino Bounce Debounce Library"
date: 2013-08-06
categories: [electronics, arduino]
tags: [library, maker, buttons]
github: "https://github.com/mpflaga/Arduino-Bounce"
status: complete
summary: "Arduino button debouncing library — filters mechanical contact noise so a single button press registers as exactly one event in firmware."
---

## Overview

Mechanical switches bounce. When you press a button, the contacts open and close rapidly several times before settling — producing dozens of spurious edge transitions in the first few milliseconds. If your firmware counts rising edges to track button presses, bounce turns one press into many.

The **Bounce** library solves this by requiring the signal to be stable for a minimum hold time before recognizing a state change. The result: one press, one event.

## Usage

```cpp
#include <Bounce.h>

Bounce button = Bounce(2, 5);  // pin 2, 5ms debounce interval

void loop() {
  button.update();
  if (button.fallingEdge()) {
    // button was pressed — fires exactly once
  }
}
```

## Why This Matters

Debouncing in hardware (RC filter + Schmitt trigger) works but adds cost and PCB space. Software debouncing in a library is free and tunable — adjust the hold time to match the specific switch you're using. Tactile switches typically need 5–20 ms; toggle switches may need more.
