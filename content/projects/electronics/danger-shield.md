---
title: "Arduino Danger Shield — Learning PCB Redesign"
date: 2018-05-21
categories: [electronics, arduino]
tags: [pcb, eaglecad, education, stem, danger-shield, sparkfun, class]
github: "https://github.com/lansing-makers-network/LMN_Danger_Shield"
docs: "https://docs.google.com/presentation/d/15lr8KB6GJmrQk3-LWpdrX4vdEVFVbdXA/edit?usp=sharing"
cover: /images/projects/danger-shield.png
status: complete
summary: "Custom Arduino shield redesigned for an intro Arduino class after SparkFun discontinued the original Danger Shield — adds improved components and layout while keeping the same hands-on exercise set."
---

## Overview

The SparkFun Danger Shield was a popular learning board that plugged directly onto an Arduino UNO, giving beginners a rich set of inputs and outputs in one self-contained package. When SparkFun discontinued it, a replacement was designed with updated components and used as the foundation of a two-session intro Arduino class — one session to build it, one to program it.

## Shield Components

- 3 slider potentiometers (analog input)
- 2 LEDs (digital and PWM output)
- Piezo buzzer (tone output)
- Photocell / LDR (analog light sensing)
- Temperature sensor (analog, TMP36-style)
- Capacitive touch pad
- 3 momentary push buttons (digital input with internal pull-ups)
- 8-bit shift register driving a 7-segment LED display
- Power LED and reset button

## The Class

### Session 1 — Soldering

Students assembled the shield from a bare PCB and components, making it a hands-on introduction to soldering for microelectronics. By the end of the session each student had a working shield ready for the next class.

### Session 2 — Programming

The second session used a slide deck (linked above) to walk through each peripheral individually, with a standalone code exercise for each one — the exercise code is in the GitHub repository (linked above). The session culminated in combining everything into a single sketch that read multiple sensors and drove multiple outputs simultaneously — putting all the pieces together.

## Class Exercises

The second session stepped through each component as a standalone exercise:

| Exercise | Concepts covered |
|---|---|
| Blink LEDs | `digitalWrite`, `digitalRead`, `delay` |
| Buttons | `INPUT_PULLUP`, active-low logic |
| Sliders | `analogRead`, 0–1023 range, `sprintf` |
| Fade LED | `analogWrite` (PWM), `map()` |
| Temperature | ADC-to-mV conversion, TMP36 offset math |
| Slider/Tone | `tone()`, `noTone()`, frequency mapping |
| Capacitive touch | `CapacitiveSensor` library |
| 7-Segment display | Shift register, SPI bit-banging, `shiftOut` |
| PANIC | Photocell baseline + threshold, `while` loops |
| Servo | `Servo.h`, `write()`, sweep (servo not included on shield) |

## Beyond the Classroom

The shield's sliders and buttons also make it a handy general-purpose controller. One fun application: using it to fly a [Syma toy helicopter](/projects/arduino/syma-helicopter-ir/) via IR — the three sliders map directly to throttle, yaw, and pitch.

## Files

Schematic and PCB files are in the [GitHub repository](https://github.com/lansing-makers-network/LMN_Danger_Shield).
