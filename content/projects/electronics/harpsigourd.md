---
title: "HarpsiGourd — Capacitive Touch Pumpkin Instrument"
date: 2016-11-02
categories: [electronics, arduino, audio]
tags: [capacitive-touch, neopixel, mp3, mpr121, ws2812, halloween, pumpkin, midi, maker, maker-faire]
github: "https://github.com/lansing-makers-network/Arduino-harpsi-gourd"
hackaday: "https://hackaday.io/project/17510-arduino-harpsi-gourd"
cover: /images/projects/harpsigourd-arduino.jpg
photos: "https://photos.app.goo.gl/ahDYrt1on1wZVnwK9"
status: complete
summary: "The electronics half of the HarpsiGourd — 15 pumpkins wired as capacitive touch keys driving a Music Maker MP3 shield. Pairs with the CNC Faux Piano shell for exhibition use."
---

## Overview

Built for Lansing How-To Halloween, the HarpsiGourd replaces the harpsichord's ivory keys with small pumpkins — a nod to Lurch of the Addams Family, swapping the over-rated touch-sensitive banana for something more seasonally appropriate.

Each pumpkin is a capacitive touch key. Touch it, hear a note. The panel was originally sized to drop onto a real upright piano keyboard — but after one too many trips hauling a full piano to exhibitions, the team built a collapsible CNC-milled shell to replace it. See the [HarpsiGourd Faux Piano](/projects/woodwork/harpsigourd-faux-piano/) project for the enclosure.

Covered by [Hackaday](https://hackaday.com/2016/11/06/harpsi-gourd-gets-you-into-thanksgiving-spirit/) and fully documented on [Instructables](https://www.instructables.com/Arudino-Harpsi-Gourd/).

## Hardware

- Arduino Uno R3 (ATmega328)
- SparkFun Music Maker MP3 Shield with 3W stereo amplifier
- 2× MPR121 12-channel capacitive touch shields (stacked via extended R3 pinout)
- WS2812 addressable RGB LED strand (NeoPixel-compatible)
- 25-conductor ribbon cable (~53") connecting shields to pumpkin electrodes
- 15 small pumpkins on a ½" plywood platform with wooden pedestals
- 2" hole saw openings in each pumpkin base; ½" electrode holes through bottom

## How It Works

Each pumpkin has a nail electrode wired back through the ribbon cable to an MPR121 capacitive touch sensor. The Arduino monitors all 15 channels and triggers the corresponding MP3 sample through the Music Maker shield when contact is detected.

The design supports up to 48 keys (4× MPR121 shields) — enough for a full four-octave range.

## Idle Mode

When no one is playing, the sketch cycles through all pumpkins automatically, playing each assigned MIDI note while stepping through different instrument voices — making it a self-running demo exhibit.
