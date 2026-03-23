---
title: "Christmas Tree Water Sensor Holder — Aqara Leak"
date: 2026-03-22
categories: [3d-printing, home-assistant]
tags: [bambu, makerworld, aqara, zigbee, christmas]
makerworld: "https://makerworld.com/en/models/2561520-christmas-tree-water-sensor-holder-aqara-leak"
cover: /images/projects/xmas-tree-water-sensor-holder.png
status: complete
summary: "Clip-on holder turns an Aqara Water Leak Sensor into a Christmas tree bowl water level monitor — no more dry trees."
---

## Overview

A clip-on holder for an Aqara Water Leak Sensor that turns it into a Christmas tree stand water level monitor.

The holder clips over the lip of a standard tree water bowl. A long tongue extends down into the water to a user-selected depth — this sets the low-water threshold. Two wires run from the Aqara sensor's detection screws, through a pair of holes in the tongue, down to the tip where they are stripped to expose bare metal. When the water level drops below the wire tips, the Aqara sensor triggers and sends a notification through Home Assistant or any Zigbee hub.

The Aqara sensor snaps into the holder above the bowl rim, staying dry while the sensing is done by the extended wires below.

## Home Assistant Integration

The Aqara reports "leak detected" when the wires are dry — the opposite of what you want to see on a dashboard. Create a Template Binary Sensor helper that inverts the signal, turning "leak detected" into "Bowl Has Water." This gives a clean, intuitive sensor state for dashboards and automations.

```yaml
template:
  - binary_sensor:
      - name: "Christmas Tree Bowl Has Water"
        device_class: moisture
        state: "{{ is_state('binary_sensor.xmas_tree_water', 'off') }}"
```

Pair it with a simple automation: when "Bowl Has Water" turns off (water drops below the wire tips), send a notification to your phone. No more dry trees.

## Files

Print files are published on [MakerWorld](https://makerworld.com/en/models/2561520-christmas-tree-water-sensor-holder-aqara-leak).
