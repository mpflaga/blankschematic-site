---
title: "Zigbee Toilet Flush Sensor"
date: 2026-09-20
categories: [electronics, home-assistant, 3d-printing]
tags: [zigbee, hall-effect, reed-switch, hardware-hack, sensor-mod, aqara, makerworld, float-switch]
status: complete
cover: /images/projects/zigbee-toilet-flush-sensor.png
makerworld: "https://makerworld.com/en/models/3334974-toilet-tank-float-monitor"
photos: "https://photos.app.goo.gl/TjgV6XFxW1NEqVRSA"
summary: "A 3D-printed clip mounts a submersible float switch on a toilet tank's overflow tube and wires it into the same desoldered-Hall-effect Zigbee mod used for the office chair sensor. The result: Home Assistant catches a stuck fill valve before it turns into a running toilet, and gets a flush count for free."
---

## The problem

A toilet's fill valve fails quietly. The flapper doesn't seat, or the valve doesn't fully shut, and the tank refills forever — running for hours, sometimes days, before anyone notices the sound or the water bill. A leak sensor on the floor only catches it after the tank has actually overflowed. What's missing is visibility into the tank *itself*: is it refilling within the time it normally takes, or has it been trying for far longer than that?

The tank is also a source of data nobody's collecting: every flush is a full drain-and-refill cycle. If the tank level is being watched anyway, that same signal counts flushes for free.

## Standing on the chair sensor's shoulders

This project reuses the exact board mod built for the [Zigbee Chair Occupancy Sensor](/projects/electronics/zigbee-chair-occupancy-sensor/): take a commodity Zigbee door/window sensor, desolder the Hall-effect chip that would otherwise fight an external contact, and wire two leads — ground and signal — out to a small connector. That project has the full teardown: why a reed switch alone works but a Hall-effect chip doesn't, the totem-pole output conflict that makes desoldering it necessary, and exactly where the wires land on the board. This project picks up right where that one leaves off, with a different passive contact on the other end of those two wires.

The sensor gutted for this particular build is a different manufacturer than the one shown in that write-up — different PCB layout, different pad locations — but the same concept: find the Hall-effect chip, take it out, and tap ground and signal off the board it leaves behind. A [teardown photo album](https://photos.app.goo.gl/W5KfGH8h5ey5xWj18) documents this specific board, for anyone matching the mod to a sensor they already have on hand rather than the exact model used for the chair.

Here, that contact is a **submersible float switch** instead of a pressure pad:

![Submersible float switch with lead wires, the kind used in tanks and reservoirs](/images/projects/zigbee-toilet-flush-sensor-float-switch.png)

Same two-wire, no-electronics interface as the reed switch or the seat pad — the sensor's MCU still just watches a pin go high or low. It has no idea whether that's a door, a chair, or a toilet tank.

## Mounting it: a 3D-printed clip for the overflow tube

A float switch on its own has nowhere to live inside a toilet tank — there's no bracket for it, and hardware-store zip-tie mounting doesn't hold position reliably as the water agitates during a flush. The fix is a small 3D-printed clip that grips the tank's **overflow tube** (the tube in the middle of the tank that routes excess water into the bowl if the fill valve fails), positioning the float switch right at the tank's normal full water line.

![The float switch and modified Zigbee sensor dry-fit assembled on the bench before installation](/images/projects/zigbee-toilet-flush-sensor-bench-assembly.jpg)

That position matters: mounted at the normal fill line, the switch sits at rest in its "tank full" state almost all the time. It only changes state for the short window during and after a flush, while the tank drains and refills — or for an abnormally long window if the fill valve fails to shut the tank off at that level.

Print it in **PETG**, or another water-resistant, non-absorbing filament — this part lives permanently inside the tank, partly submerged, and standard PLA will absorb water and degrade over months in that environment.

Files are on [MakerWorld](https://makerworld.com/en/models/3334974-toilet-tank-float-monitor).

## Installed

<div class="compare-row">
  <figure>
    <img src="/images/projects/zigbee-toilet-flush-sensor-installed-dry.jpg" alt="Clip and float switch installed on the overflow tube, tank drained during a flush">
    <figcaption>During flush</figcaption>
  </figure>
  <figure>
    <img src="/images/projects/zigbee-toilet-flush-sensor-installed-wet.jpg" alt="Same installation with the tank refilled after the flush completes">
    <figcaption>After flush</figcaption>
  </figure>
</div>

The modified sensor mounts on the tank wall, above the water line, where it stays dry — only the float switch and its leads go in the water. Part of the label is blurred where it would otherwise show the device's Zigbee IEEE address.

## Home Assistant integration

The raw `binary_sensor` reports whatever the float switch's contact state happens to be at rest, which may or may not read intuitively as "full" depending on how the switch is wired and oriented. Same as the [Christmas tree water sensor holder](/projects/3d-printing/xmas-tree-water-sensor-holder/), the cleanest fix is a template binary sensor that normalizes it to something a dashboard or automation can read at a glance:

```yaml
template:
  - binary_sensor:
      - name: "Front Bathroom Toilet Tank Full"
        device_class: moisture
        state: "{{ is_state('binary_sensor.front_bathroom_toilet_water', 'off') }}"
```

**Stuck fill valve.** An automation watches for the tank to stay in the *not full* state — draining or refilling — longer than a normal flush cycle ever takes:

```yaml
automation:
  - alias: "Front bathroom toilet fill valve stuck"
    trigger:
      - platform: state
        entity_id: binary_sensor.front_bathroom_toilet_tank_full
        to: "off"
        for: "00:10:00"
    action:
      - service: notify.mobile_app
        data:
          message: "Front bathroom toilet has been refilling for over 10 minutes — check the fill valve."
```

Ten minutes is well beyond any real flush-and-refill cycle, so this only fires when something's actually stuck.

**Flush count.** Every full drain-and-refill cycle is one *full → not full → full* transition. A counter helper incremented on the return to full turns that into a running tally:

```yaml
automation:
  - alias: "Front bathroom flush counter"
    trigger:
      - platform: state
        entity_id: binary_sensor.front_bathroom_toilet_tank_full
        from: "off"
        to: "on"
    action:
      - service: counter.increment
        target:
          entity_id: counter.front_bathroom_flush_count
```

Useful for noticing usage patterns, or just for knowing a fixture is actually being used at all.

## The same trick, a third time

That's three passive contacts now wired into the same board mod: a seat pressure pad for [chair occupancy](/projects/electronics/zigbee-chair-occupancy-sensor/), a water level probe in the Christmas tree stand, and this float switch. None of them needed a different sensor, a different radio, or different firmware — just a different passive contact on the other end of the same two wires.

## Getting it

The 3D-printable clip is on [MakerWorld](https://makerworld.com/en/models/3334974-toilet-tank-float-monitor) — print it in PETG or another water-resistant filament. The board mod itself (desoldering the Hall-effect chip, wiring out ground and signal) is documented in full on the [Zigbee Chair Occupancy Sensor](/projects/electronics/zigbee-chair-occupancy-sensor/) page; everything past that point is just this float switch and this clip.
