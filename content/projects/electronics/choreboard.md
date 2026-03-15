---
title: "ChoreBoard — Raspberry Pi NeoPixel Chore Tracker"
date: 2018-05-24
categories: [electronics, raspberry-pi]
tags: [raspberry-pi, neopixel, python, maker, led]
github: "https://github.com/mpflaga/ChoreBoard-RaspberryPi"
status: complete
summary: "Raspberry Pi Zero W chore tracker — physical buttons and NeoPixel LEDs show daily task progress in a tactile, screen-free display for kids."
---

## Overview

ChoreBoard is a Raspberry Pi Zero W–based physical dashboard for tracking daily chores. Each chore gets a button and a corresponding NeoPixel LED. Press the button when a task is done and the LED lights up — no phone, no screen, no app needed.

## Hardware

- **Raspberry Pi Zero W** — runs the Python application, handles Wi-Fi for optional reset scheduling
- **NeoPixel LEDs** — individually addressable RGB LEDs, one per chore slot
- **Push buttons** — one per chore, wired to GPIO pins
- Enclosure or panel to mount buttons and LEDs in a visible location

## How It Works

The Python application runs on startup and listens for button presses via GPIO. When a button is pressed, the corresponding NeoPixel turns on (green, or a chosen color). All lights reset at a scheduled time — daily reset is handled automatically so each morning starts fresh.

The NeoPixel strip allows each LED to be set to any color, making it easy to indicate states: incomplete, in-progress, done, or skipped.

## Why Physical

Screens require attention. A chore board with physical buttons and colored LEDs is immediately readable across the room — you can see at a glance which tasks are done without picking up a device. Kids can interact with it independently without needing an account or unlock code.
