---
title: "Syma Helicopter IR Control Hack"
date: 2013-06-01
categories: [electronics, arduino]
tags: [ir, helicopter, remote-control, irremote]
github: "https://github.com/mpflaga/Arduino-IRremote"
cover: /images/projects/syma-helicopter.jpg
status: complete
summary: "Reverse-engineered the IR protocol between Syma toy helicopters and their controllers using Arduino, enabling cross-control of multiple choppers or repurposing the controller for other devices."
---

## Overview

Syma RC helicopters use a simple infrared protocol between the transmitter and the helicopter — simple enough to decode, replay, and repurpose with an Arduino and an IR receiver/transmitter pair.

This project reverse-engineered that protocol so that:

- **Cross-control** — one transmitter could fly a different brand or model of chopper
- **Repurposing** — the physical helicopter controller could drive other devices entirely (servos, relays, displays, etc.)

The work was contributed to and integrated with the Arduino **IRremote** library, adding Syma helicopter protocol support for the broader community.

## How It Works

An IR receiver module captures the raw timing pulses from the transmitter. The Arduino decodes these into the Syma protocol's channel, throttle, yaw, and pitch values. The same values can then be re-transmitted via an IR LED to any compatible receiver — whether the original helicopter or a custom load.

By mapping the stick inputs to arbitrary outputs, the controller becomes a general-purpose IR-based input device.
