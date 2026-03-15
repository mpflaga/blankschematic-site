---
title: "Open Source Pinewood Derby Track"
date: 2015-04-13
categories: [bsa, electronics]
tags: [arduino, eagle, pcb, cub-scouts, lmn, maker]
github: "https://github.com/mpflaga/PineWoodDerbyTrack-Arduino"
github2: "https://github.com/mpflaga/PineWoodDerby_Mega_Shield-Eagle"
hackaday: "https://hackaday.com/2015/04/13/an-open-source-pinewood-derby-track/"
youtube: "https://youtu.be/da9Q15YSw38"
status: complete
summary: "A fully open source, 38-foot, 4-lane pinewood derby timing system built for Lansing Makers Network — Arduino Mega, custom PCB, IR sensors, solenoid starting gate, and 7-segment displays."
---

## Overview

The Lansing Makers Network needed a pinewood derby track that local cub scouts could use to test their racers during open shop hours. Rather than buy a commercial solution, we built a fully open source system from scratch — track, electronics, firmware, and PCB all included.

The result is a 38-foot, 4-lane track with a solenoid-activated starting gate, IR timing sensors, and a custom display panel showing each lane's finishing position and elapsed time. Hackaday covered it in April 2015.

## The Track

Five 8-foot sections of prefinished ¾" 11-layer cabinet plywood connect end-to-end using 4" lap joints, forming a continuous 38-foot run. The prefinished surface keeps friction low — fast cars have turned in times as low as 2.8 seconds over the 33-foot start-to-finish distance, with most racers averaging between 3.1 and 3.4 seconds.

Four lanes are defined by ¼" maple plywood strips acting as wheel guides. The final 4 feet after the finish line form a braking runoff — the lane guides raise an extra ½" and are lined with 2mm craft foam to gently decelerate the cars without damaging them.

## Starting Gate

The starting gate uses a plywood trap door mounted under the elevated starting area. Four pins protrude up through the track surface, holding each car in place. When the operator presses the start button (or pulls the remote trigger), a latching solenoid releases the trap door, dropping the pins and sending all four cars simultaneously.

A sensor on the door detects when it has actually dropped, starting the race timer. Closing the door clears the display and readies the system for the next heat.

A remote trigger — elastic phone cord, PVC pipe handle, and a red button — allows the race to be started away from the starting gate.

## Electronics & Timing

The timing computer is built around an **Arduino Mega 2560** with a custom shield (Eagle files in the companion repo).

IR reflective object sensors are embedded flush into the lane guides at both the starting gate and finish line. Each sensor has pull-up and current-limiting resistors soldered directly to it, with wiring run underneath the track sections. Connections use **RJ45 modular jacks** (standard telecom wall-plate style) recessed into the track sides — sturdy, flush, and connected via ordinary CAT-5 patch cables.

The starting gate solenoid connects via an RCA jack; the remote trigger uses an RJ11 connector — different connector types prevent mis-cabling.

Power is either a 12V DC wall supply (2.5mm barrel jack) or battery for portable use.

## Display Panel

The display panel mounts vertically behind the starting gate and shows results for all four lanes:

- **Large 2.3" alphanumeric digits** — driven by SPI-based HC595 shift registers — show finishing position per lane
- **Small 0.54" quad alphanumeric digits** — driven by I2C HT16K33 backpack modules — show elapsed time per lane

All digits are mounted in a laser-cut ⅛" plywood panel behind smoke-grey transparent acrylic, which diffuses the display for comfortable viewing in a variety of lighting conditions.

The firmware also uses the displays for operational status: racers ready, lane missing a car, track not ready, race complete — making it easy for a single operator to run heats.

## PCB

The Arduino shield was designed in **Eagle CAD** and provides:
- RJ45 breakout for start and finish sensor cables
- RCA and RJ11 connectors for solenoid and remote trigger
- HC595 SPI shift register chain for the large digit drivers
- I2C headers for HT16K33 backpack modules
- 12V power input with onboard regulation

Eagle schematic and board files are in the companion repository.

## Repositories

| Repo | Contents |
|------|----------|
| [PineWoodDerbyTrack-Arduino](https://github.com/mpflaga/PineWoodDerbyTrack-Arduino) | Arduino Mega firmware |
| [PineWoodDerby_Mega_Shield-Eagle](https://github.com/mpflaga/PineWoodDerby_Mega_Shield-Eagle) | Eagle PCB schematic and board files |

## Coverage

- [Hackaday — "An Open Source Pinewood Derby Track"](https://hackaday.com/2015/04/13/an-open-source-pinewood-derby-track/) — April 13, 2015
- [YouTube demo video](https://youtu.be/da9Q15YSw38)

## Photos

{{< figure src="/images/projects/pinewood-derby/track-full.jpg" alt="Full 38-foot track assembled" >}}

<!-- Add photos from: