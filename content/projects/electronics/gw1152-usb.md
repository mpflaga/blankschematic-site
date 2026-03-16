---
title: "GW1152 USB Adapter PCB"
date: 2024-01-01
categories: [electronics]
tags: [pcb, kicad, usb, networking, westermo, hardware-addon]
github: "https://github.com/mpflaga/GW1152-USB"
status: complete
cover: /images/projects/gw1152-usb.png
summary: "Daughter PCB that exposes the internal USB port externally on the VirtualAccess GW1152 router from Westermo."
---

## Overview

The [VirtualAccess GW1152](https://www.westermo.com) from Westermo includes an internal USB interface that is not accessible from the outside of the enclosure. This daughter PCB adaptor routes that USB connection to an external-facing port, making it available for peripherals or debugging without opening the unit.

## Design

A compact add-on PCB designed to mount inside the GW1152 enclosure, picking up the internal USB signals and routing them to a standard external connector.

## Files

KiCad schematic and board files are in the repository.
