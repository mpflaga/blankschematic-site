---
title: "Impression 5 Genome / Plant Migration Map"
date: 2021-07-19
categories: [museum, electronics, arduino]
tags: [arduino, rfid, led, maker, lmn, impression5, interactive]
github: "https://github.com/mpflaga/Impression5-GenomeMap-Arduino"
github2: "https://github.com/mpflaga/Impression5-GenomeMap-Demo-Arduino"
github2label: "github (demo) ↗"
status: complete
cover: /images/projects/impression-5-genome-map.jpg
photos: "https://photos.app.goo.gl/ZSywspWpcvun5nEw8"
summary: "Interactive museum exhibit at Impression 5 Science Center — visitors use RFID tablets to explore botanical migration routes on a lit map, with green/red LED feedback guiding correct selections."
---

## Overview

The Genome Map exhibit at [Impression 5 Science Center](https://impression5.org) in Lansing, MI teaches young visitors about the historical migration of plants across continents. This is the Arduino firmware that drives the interactive hardware.

## How the Experience Works

1. A visitor picks up a **physical tablet** (a small card or tile representing a specific plant) and places it on a designated spot on the tabletop surface.
2. An **RFID reader** identifies the plant tablet and starts the experience by illuminating its origin region on the map.
3. On-screen clues prompt the visitor to find the plant's migration path. They select regions by **touching the map surface**.
4. **Correct region selections** flash green, then draw a connecting line to the next waypoint.
5. **Incorrect selections** flash red and remain interactive until the right region is chosen.
6. Once the full migration path is identified, the completed route illuminates.

An **idle timeout** detects when no one is interacting and causes regions to flash in a cycle — drawing in new visitors and encouraging participation.

## Electronics

The system is built around an Arduino with:
- **RFID reader** — identifies which plant tablet is placed on the activation spot
- **Capacitive or resistive touch inputs** — detect map region touches
- **LED arrays** — per-region illumination for green/red feedback and path drawing

## Hardware Platform

The PCB foundation is the **[Impression 5 SMASH Shield](https://github.com/mpflaga/Impression5-SMASH-Shield-Eagle)** — an Eagle CAD Arduino Mega shield designed specifically for Impression 5 exhibits, providing standardized connectors for display, input, and power wiring.

## Repositories

| Repo | Contents |
|------|----------|
| [Impression5-GenomeMap-Arduino](https://github.com/mpflaga/Impression5-GenomeMap-Arduino) | Delivered exhibit firmware |
| [Impression5-GenomeMap-Demo-Arduino](https://github.com/mpflaga/Impression5-GenomeMap-Demo-Arduino) | Quick proof of concept |

## Photos

[View the photo album on Google Photos ↗](https://photos.app.goo.gl/ZSywspWpcvun5nEw8)
