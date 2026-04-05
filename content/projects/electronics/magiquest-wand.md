---
title: "MagiQuest Wand Duel — Maker Faire Kiosk"
date: 2013-06-01
categories: [arduino]
tags: [electronics, ir, magiquest, maker-faire, attiny, neopixel]
github: "https://gist.github.com/mpflaga/6091076"
github2: "https://gist.github.com/mpflaga/fe91612db2ed75d21489b2e17c08b387"
github2label: "IrMagicWandDuelNeoPixel gist ↗"
cover: /images/projects/magiquest-wand.jpg
status: complete
summary: "A MagiQuest wand duel kiosk built for Maker Faire Detroit — two players wave their wands, one wins. Started as an ATtiny85 DigiSpark and later grew into a full NeoPixel ring display with EEPROM config and learn mode."
---

## Overview

Built for **Maker Faire Detroit**, this kiosk lets two people face off with their MagiQuest wands. Each player waves their wand at an IR receiver; the device reads the wand serial numbers, decides a winner from a configured table, and announces the result.

It builds directly on the [MagiQuest IR protocol library](/projects/arduino/magiquest-ir-library/) that decoded how the wands communicate.

---

## TinyIRduel — ATtiny85 Version (2013)

**[Gist](https://gist.github.com/mpflaga/6091076)**

The original Maker Faire build on a DigiSpark (ATtiny85). An IR receiver reads incoming wand codes and looks up each serial number against a hardcoded winner/loser table. Results are delivered via:

- **Winner** — IR jam tone at 39 kHz, buzzer chirp, LED blink
- **Loser** — both LEDs solid

Small, cheap, and kiosk-reliable enough to run on a table at Maker Faire.

---

## IrMagicWandDuelNeoPixel — NeoPixel Upgrade (2016)

**[Gist](https://gist.github.com/mpflaga/fe91612db2ed75d21489b2e17c08b387)**

A full rewrite on a larger Arduino, replacing the indicator LEDs with a 24-pixel NeoPixel ring for much more satisfying feedback:

- **Winner animation** — twinkle effect with random colors, buzzer, 39 kHz IR jam tone
- **Loser animation** — solid red blink
- **Unknown wand** — `?` pattern on the ring

Beyond the display upgrade, this version added a full configuration system:

- **EEPROM config** — winner/loser wand IDs, mute flag, and team assignment survive power cycles
- **Learn mode** — point any wand to teach the system new IDs without reflashing
- **IR remote control** — MITSUBISHI protocol remote adjusts settings without needing a serial connection
- **Idle power-off** — shuts down after 30 minutes of inactivity via `SHUTDOWNn` pin
- **Watchdog reset** — WDT keeps it stable in a kiosk environment
- **Serial menu** — `m` mute, `1`/`2` set wands, `t` team, `u` unknown, `l` learn, `i` info, `r` reset
