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

Syma 107 RC helicopters use a simple infrared protocol between the transmitter and the helicopter — straightforward enough to decode, replay, and repurpose with an Arduino and an IR receiver/transmitter pair. A similar competing brand was also supported, though it required a non-standard checksum.

This project reverse-engineered that protocol to enable two directions of control:

- **Act as a transmitter** — an Arduino with an IR LED can fly one or more choppers of different brands or models
- **Act as a receiver** — the helicopter itself can be replaced by an Arduino with an IR receiver, letting Arduino code respond to the controller's inputs

This work was contributed to and integrated into the Arduino **IRremote** library, adding Syma helicopter protocol support for the broader community.

## How It Works

A 38 kHz IR receiver module captures the raw timing pulses from the transmitter. The Arduino decodes these into the protocol's channel, throttle, yaw, and pitch values. The same values can then be re-transmitted via an IR LED to any compatible receiver — whether the original helicopter or a custom load.

By mapping the stick inputs to arbitrary outputs, the controller becomes a general-purpose IR-based input device.

## Demo - Danger Shield
A great demo of this is using the **[Danger Shield](/projects/electronics/danger-shield/)** — its three sliders map to throttle, yaw, and pitch of a chopper, and with some models a button fires the spring-loaded rocket.