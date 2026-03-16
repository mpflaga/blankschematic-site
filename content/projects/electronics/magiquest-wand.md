---
title: "MagiQuest Wand Projects — From ATtiny85 to ESPHome"
date: 2025-01-25
categories: [electronics, home-assistant]
tags: [arduino, ir, neopixel, magiquest, attiny, esphome, home-assistant]
github: "https://gist.github.com/mpflaga/ad8640589b4739bdb1a9b0abac68ef03"
status: complete
summary: "A 12-year arc of MagiQuest wand projects — from a DigiSpark ATtiny85 duel kiosk in 2013, through NeoPixel ring upgrades and a learn/simulate device, to a 2025 ESPHome Home Assistant sensor."
---

## Overview

[MagiQuest](https://www.magiquest.com/) is an interactive LARP-style game where players carry IR-transmitting wands to cast spells at sensors throughout the venue. Each wand broadcasts a unique IR code — which turns out to be perfectly hackable with an Arduino and an IR receiver.

These projects span 2013–2025 and represent an ongoing thread of wand-related electronics, each building on the last.

---

## 1. TinyIRduel — ATtiny85 Duel Kiosk (2013)

**[Gist](https://gist.github.com/mpflaga/6091076)**

The original. A DigiSpark (ATtiny85) board reads MagiQuest IR codes from a receiver and decides winner vs. loser from a hardcoded table of wand IDs. Winner gets an IR jam tone at 39 kHz plus buzzer and LED blink. Loser gets both LEDs solid.

Small, cheap, and the foundation for everything that followed.

---

## 2. IrMagicWandDuelNeoPixel — NeoPixel Ring Upgrade (2016)

**[Gist](https://gist.github.com/mpflaga/fe91612db2ed75d21489b2e17c08b387)**

A full rewrite on a larger Arduino, adding a 24-pixel NeoPixel ring for visual feedback:

- **Winner animation** — twinkle effect with random colors + buzzer + 39 kHz IR jam tone
- **Loser animation** — solid red blink
- **Unknown wand** — `?` pattern on the ring
- **EEPROM config** — winner/loser wand IDs, mute flag, team assignment survive power cycles
- **Learn mode** — point any wand to teach the system new IDs
- **IR remote control** — MITSUBISHI protocol remote to adjust settings without serial
- **Idle power-off** — shuts down after 30 minutes of inactivity via `SHUTDOWNn` pin
- **WDT reset** — watchdog keeps it stable in a kiosk environment
- **Serial menu** — `m` mute, `1`/`2` set wands, `t` team, `u` unknown, `l` learn, `i` info, `r` reset

---

## 3. IrSonicWand — Learn and Simulate Any Wand (2017)

**[Gist](https://gist.github.com/mpflaga/d2f9a63ea7544d2b976f8665c97a4d3c)**

A handheld device that can **learn** up to 4 real wand IDs from IR and then **replay** them — effectively a universal wand emulator. Two potentiometers control the IR magnitude and a frequency wobble parameter.

Hardware: 12 pins total — IR receiver, IR transmitter, 6 Bounce2-debounced buttons, LEDs, piezo speaker, 2 analog pots. Wand IDs and magnitude are stored in EEPROM and survive power cycles. Two-stage learn mode to avoid accidental overwrites.

Uses a fork of the IRremote library for MagiQuest protocol encoding/decoding.

---

## 4. ESPHome MagiQuest Wand Sensor (2025)

**[Gist](https://gist.github.com/mpflaga/ad8640589b4739bdb1a9b0abac68ef03)**

The latest iteration — now integrated with Home Assistant via ESPHome on a Wemos D1 Mini (ESP8285). An IR receiver on GPIO2 decodes incoming wand codes and exposes 8 binary sensors (one per known wand ID) directly in Home Assistant, with a 1-second `delayed_off` filter so automations see a clean pulse.

```yaml
binary_sensor:
  - platform: remote_receiver
    name: "Wand Blue Cap"
    raw:
      code: [...]   # MagiQuest IR code for this wand
    filters:
      - delayed_off: 1s
```

Now any wand wave can trigger a Home Assistant automation — lights, sounds, whatever you want.
