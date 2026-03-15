---
title: "Vixen Christmas Light Controller — Arduino Mega Daisy Chain"
date: 2014-11-28
categories: [electronics]
tags: [arduino, vixen, christmas, lighting, maker, serial]
github: "https://gist.github.com/mpflaga/b93d8375a10af06143b2"
status: complete
summary: "Arduino Mega sketch for sequenced Christmas lights using Vixen lighting software — supports daisy-chaining multiple Arduinos for up to 51 channels per board via serial passthrough."
---

## Overview

[Vixen Lights](http://www.vixenlights.com/) is free PC software for sequencing Christmas light displays to music. It sends channel data over serial to a controller, which maps the channels to output pins driving relay boards or SSRs.

This sketch turns an **Arduino Mega 2560** into a Vixen controller with support for daisy-chaining multiple boards — so a large display can use more channels than a single Arduino provides.

## How It Works

Vixen sends a packet of channel bytes terminated by an `'E'` footer character over serial. The Arduino reads 43 bytes, maps them to GPIO pins 3–53 (skipping serial port pins), and drives them HIGH or LOW.

```cpp
// First board reads from USB serial; chained boards read from Serial2
#define FIRST_IN_CHAIN

#ifdef FIRST_IN_CHAIN
  #define INPUT_SERIAL Serial
#else
  #define INPUT_SERIAL Serial2
#endif
```

After consuming its 43 channels, the board forwards the remaining bytes downstream via `Serial3` to the next Arduino in the chain. Each board in the chain consumes its slice and passes the rest along.

## Channels Per Board

- **Pins 3–53** = 51 potential output pins per Mega
- Serial port pins (0, 1, 14, 15, 16, 17) are excluded from output to avoid conflicts
- Multiple boards chained = 51 × N total channels

## Hardware Setup

- Arduino Mega 2560 (one per ~50 channels)
- Relay board or solid-state relay (SSR) array connected to output pins
- `Serial3` TX on board N → `Serial2` RX on board N+1
- USB from PC to first board only

## Vixen Configuration

In Vixen, configure a **Generic Serial** controller pointed at the COM port of the first Arduino at 115200 baud. Sequence channels 1–43 (or however many you're using) to the controller output.
