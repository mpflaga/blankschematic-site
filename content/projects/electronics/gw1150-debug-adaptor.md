---
title: "GW1150 Debug Adapter PCB"
date: 2024-01-01
categories: [electronics]
tags: [pcb, kicad, schematic, serial, debug, westermo, hardware-addon]
github: "https://github.com/mpflaga/GW1150-Debug-Adaptor"
status: complete
cover: /images/projects/gw1150-debug-adaptor.png
summary: "Cable/PCB adapter that converts any VirtualAccess/GW power supply connector to a standard USB-to-TTL/3.3V serial adapter for quick debug access on Westermo GW-series devices."
---

## Overview

Debugging VirtualAccess/GW-series devices from Westermo typically requires adapting their proprietary power supply connector to a serial interface. This KiCad PCB adapter provides a quick, clean conversion to a common USB-to-TTL/3.3V serial adapter — no improvised wiring needed.

## Design

A small cable/PCB adapter that maps the VA/GW power supply pinout to the standard connector used by common USB-to-TTL serial adapters. Designed for fast attachment during field or bench debugging.

## Files

KiCad schematic and board files are in the repository.
