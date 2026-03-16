---
title: "Impression 5 SMASH Shield PCB"
date: 2019-07-22
categories: [museum, electronics]
tags: [arduino, pcb, eaglecad, maker, lmn, impression5]
github: "https://github.com/mpflaga/Impression5-SMASH-Shield-Eagle"
status: complete
summary: "Eagle CAD Arduino Mega shield PCB designed for Impression 5 Science Center exhibits — standardizes wiring, connectors, and power for the Giant Calculator and Genome Map projects."
---

## Overview

The **SMASH Shield** (Science Museum Arduino Shield for Hardware) is a custom Arduino Mega shield designed to serve as the electronics backbone for multiple interactive exhibits at [Impression 5 Science Center](https://impression5.org) in Lansing, MI.

Rather than one-off wiring each exhibit, this reusable PCB provides a consistent platform: standardized connectors for display drivers, input panels, and power — the same board works across both the Giant Calculator and the FRIB-sponsored Genome Map projects.

## Design Goals

- **Standardized connectors** — consistent pinout for display panels and input wiring across exhibits
- **Arduino Mega form factor** — stacks directly on an Arduino Mega 2560
- **Robust for museum use** — exhibits run unattended for extended periods, so the design prioritizes reliability over minimum cost
- **Eagle CAD** — schematic and board files in open-source Eagle CAD format

## Exhibits Using This Shield

- [Impression 5 Giant Calculator](https://github.com/mpflaga/Impression5-Mega_Calculator-Arduino)
- [Impression 5 Genome Map](https://github.com/mpflaga/Impression5-GenomeMap-Arduino)

## Files

The repository contains Eagle `.sch` (schematic) and `.brd` (board layout) files. The PCB was fabricated and installed in both exhibits at Impression 5.
