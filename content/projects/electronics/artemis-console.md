---
title: "Artemis Spaceship Bridge Console — BSG LCARS Interface"
date: 2016-01-01
categories: [electronics]
tags: [arduino, maker, maker-faire, hid, capacitive-touch, gaming, role-playing-game, bridge-simulator, artemis, bsg]
github: "https://github.com/mpflaga/Artemis23consoleMultiJoyStick-Arduino"
status: complete
cover: /images/projects/artemis-console.jpg
photos: "https://photos.app.goo.gl/AJAEkeWEWCe7FiBy8"
summary: "Full LCARS-style bridge simulator — hand-built capacitive touch consoles at every station, BSG 2003 aesthetic, support craft, narrated training, and spectator viewer portals."
---

## Overview

[Artemis Spaceship Bridge Simulator](http://www.artemisspaceshipbridge.com/) is a cooperative multiplayer game where each player sits at a dedicated station — helm, weapons, engineering, science, and comms — and the crew works together to operate a starship.

The team took this well beyond keyboards and joysticks. Each station has a **custom hand-built capacitive touch console** — no commercial touchscreens. These UI's are a full **LCARS-style interface**, styled after the *Battlestar Galactica* (2003) aesthetic rather than the Trek TNG look most people associate with LCARS. The Arduino firmware presents the consoles to the host PC as standard USB HID devices — no custom drivers needed.

## The Full Experience

Beyond the main bridge, the installation included:

- **4 support craft** — independently flyable vessels that crew members could launch and pilot on their own away missions alongside the main ship
- **Training room** — an onboarding space for new crew members, narrated by **Zapp Brannigan**, walking them through station roles and procedures before their first mission
- **Viewer portals** — dedicated display positions for a spectator gallery, so an audience could follow along as the crew journeyed without being in the way of active stations

## Hardware

- **Arduino** with USB HID support (Leonardo or ATmega32U4-based board) per station
- **Custom capacitive touch panels** — hand-fabricated, no commercial touchscreen hardware
- Multiple logical input axes and buttons per station, mapped to Artemis control inputs
- BSG-themed LCARS layout applied to each station's physical panel design

## How It Works

The firmware enumerates each station as a separate USB HID joystick/gamepad device over a shared USB connection. Button and axis states are read from the capacitive touch hardware and reported to the host as standard HID reports — plug and play with Artemis on any OS.

Members and visitors could experience the full bridge simulator — from training through live missions — during open shop hours.
