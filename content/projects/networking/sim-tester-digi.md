---
title: "Cellular SIM Tester — Digi WR21"
date: 2022-04-08
categories: [networking, electronics]
tags: [python, digi, cellular, sim, lcd, i2c, rotary-encoder, wr21]
github: "https://github.com/mpflaga/sim-tester-digi"
cover: /images/projects/sim-tester-digi.jpg
photos: "https://photos.app.goo.gl/NwSQ2LaEMxYaG8w69"
status: complete
summary: "Python tool for validating cellular SIM activation on a Digi WR21 router — auto-detects carrier, cycles through known APNs, and reports results via a 2-line I²C LCD with RGB rotary encoder interface."
---

## Overview

This tool validates whether a cellular SIM card is properly activated. Running as a Python script on a **Digi WR21** embedded router, it identifies the SIM's vendor or carrier, then systematically attempts each known APN associated with that carrier. Status and results are shown on an attached 2-line USB/Serial LCD text display.

## Hardware Interface

A **RGB rotary encoder** is connected via I²C to provide a simple user interface, allowing navigation and confirmation without a keyboard. The encoder and LCD share the same I²C bus, presenting a unified interface to the host Python application.

## I²C Driver Fork

The open-source driver for the 2-line LCD display originally supported I²C in slave mode only. This project forks that driver and extends it to support both **host and slave modes simultaneously**, while remaining fully backwards compatible with existing code. This enabled the rotary encoder to be hosted on the same driver, giving the Python application a single path to read input from the encoder and write output to the display.

## Use Case

SIM provisioning validation can be tedious when carrier APNs vary and activation status is opaque. This device automates the guesswork — insert the SIM, and the tester walks through the known APN list for that carrier until a data connection is confirmed or all options are exhausted.
