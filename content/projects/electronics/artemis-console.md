---
title: "Artemis Spaceship Bridge Console — Multi-Joystick Firmware"
date: 2016-01-01
categories: [electronics]
tags: [arduino, lmn, maker, hid, joystick, gaming, role-playing-game, bridge-simulator, artemis]
github: "https://github.com/mpflaga/Artemis23consoleMultiJoyStick-Arduino"
status: complete
cover: /images/projects/artemis-console.jpg
photos: "https://photos.app.goo.gl/AJAEkeWEWCe7FiBy8"
summary: "Arduino firmware for the Lansing Makers Network's Artemis Spaceship Bridge Simulator exhibit — drives a multi-joystick physical console for the cooperative spaceship bridge game."
---

## Overview

[Artemis Spaceship Bridge Simulator](http://www.artemisspaceshipbridge.com/) is a cooperative multiplayer game where each player sits at a dedicated station — helm, weapons, engineering, science, and comms — and the crew works together to operate a starship. It's best played with physical controls rather than keyboards.

The Lansing Makers Network built a physical bridge console for their space, and this is the Arduino firmware that drives it. The console presents itself to the host PC as multiple USB HID joystick/gamepad devices — one per station — so Artemis sees it as standard input hardware with no custom drivers needed.

## Hardware

- **Arduino** with USB HID support (Leonardo or similar ATmega32U4 board)
- Physical joysticks, buttons, and switches wired per station layout
- Multiple axes and buttons mapped to Artemis control inputs

## How It Works

The firmware enumerates as multiple HID joystick devices over a single USB connection. Each logical joystick maps to an Artemis bridge station. Button and axis states are read from the physical hardware and reported to the host as standard HID reports — plug and play with Artemis on any OS.

## LMN Context

This is one of several community exhibit projects built for the [Lansing Makers Network](https://lansingmakersnetwork.org/) maker space. Members and visitors can play Artemis on the physical console during open shop hours.
