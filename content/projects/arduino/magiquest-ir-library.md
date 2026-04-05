---
title: "MagiQuest IR Protocol Library & Sonic Screwdriver"
date: 2012-01-01
categories: [arduino]
tags: [electronics, ir, magiquest, irremote, home-assistant]
github: "https://github.com/mpflaga/Arduino-IRremote"
github2: "https://gist.github.com/mpflaga/d2f9a63ea7544d2b976f8665c97a4d3c"
github2label: "IrSonicWand gist ↗"
cover: /images/projects/magiquest-wand-blue.jpg
status: complete
summary: "Decoded the MagiQuest IR wand protocol on Arduino — extracting each wand's unique serial number and a swish-magnitude field — then built an IrSonicWand emulator that learns and replays any wand's identity, with sound."
---

## Overview

We brought the magic home. With this the childrens own Wands now worked beyond that of Great Wolf Lodge. They now work at home. With several Arduino's hiding through out the house. The children could turn on or off; lamps, fans, holiday lights and the Christmas tree. 

[MagiQuest](https://www.magiquest.com/) is an interactive game at venues like Great Wolf Lodge where players carry IR-transmitting wands to cast spells at sensors throughout the space. The goal here was to bring that magic home — to decode the protocol, understand what the wands were actually broadcasting, and eventually build hardware that could join in.

This work is a fork of the same Arduino **IRremote** library used in the [Syma Helicopter IR project](/projects/arduino/syma-helicopter-ir/), extended to add MagiQuest protocol support.

---

## Decoding the Protocol

Each MagiQuest wand broadcasts two values via IR:

**Serial number** — a unique ID assigned to each physical wand. Decoding this lets you identify exactly which wand is being waved, which is the foundation for everything else.

**Swish magnitude** — a second field transmitted alongside the serial number. It appeared to represent the intensity of the swish gesture. The likely mechanism: a sealed ball bearing inside the wand travels between two contact points, and the time of travel encodes magnitude.

In practice the magnitude value was unreliable. A single swish — down then back up — produces multiple IR transmissions, each with a different reading. There was no clean way to disambiguate which reading represented the intended gesture from all the backlash transmissions.

---

## IrSonicWand — A Universal Wand Emulator

With the serial number decoding in hand, the next step was to build something that could **learn** and **replay** any wand's identity.

The IrSonicWand is a handheld device with:

- **IR receiver** — point a real wand at it and the device learns that wand's serial number
- **IR transmitter** — replay any stored ID on demand, passing as that wand to any MagiQuest sensor
- **4 stored IDs** — EEPROM-backed, survives power cycles; two-stage learn mode prevents accidental overwrites
- **Sound** — makes the distinctive MagiQuest wand activation sound
- **Two potentiometers** — control IR transmission magnitude and a frequency wobble parameter
- **6 debounced buttons** — select which stored wand to transmit

Effectively a Sonic Screwdriver — one device that can impersonate any wand in the collection.


---

## Legacy

The MagiQuest protocol implementation in this library has been picked up by a number of downstream projects over the years. One notable example is the ESPHome IR remote integration, which uses the same protocol decoding to expose wand detections directly as Home Assistant binary sensors — [ESPHome wand sensor gist](https://gist.github.com/mpflaga/ad8640589b4739bdb1a9b0abac68ef03).
