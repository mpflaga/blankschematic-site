---
title: "Inside My Home Assistant Setup"
date: 2026-03-21
categories: [home-assistant]
tags: [esphome, zigbee, raspberry-pi, automation, cloudflare, mqtt, shelly, sonoff, zha, floorplan]
cover: /images/icons/homeassistant.svg
status: complete
summary: "A look inside a fully local, cloud-free Home Assistant installation — 1,900 entities, 66 automations, 20 rooms, and a Raspberry Pi 4 running the whole house."
---

Home Assistant is one of those projects that starts small — maybe one smart bulb and a curious afternoon — and gradually becomes the connective tissue of your entire house. This is a look at what's running in mine: what works, what was fun to build, and what actually gets used every day.

The short version: a Raspberry Pi 4 running Home Assistant OS, about 1,900 entities, 20 rooms, 66 automations, and 53 devices communicating over WiFi, Ethernet, and a PoE Zigbee coordinator.

## The Foundation

Everything runs on a **Raspberry Pi 4** using **Home Assistant OS** — the fully managed version that handles updates, backups, and add-ons cleanly without needing to manage a Linux server underneath it. External access runs through a **Cloudflare Tunnel** — no open ports on the router, no exposed IP address, no port forwarding. The tunnel connects outbound from the Pi to Cloudflare's edge, which proxies external traffic back in. The result is a publicly accessible URL with no attack surface on the home network side. SSL is handled by a **Let's Encrypt certificate that renews itself automatically** via an HA automation. No manual cert renewals, no open firewall rules.

Zigbee runs through an **SLZB-06** network coordinator — a standalone networked device running a Texas Instruments CC2652 chip. It handles 53 Zigbee devices across the house, all local, no cloud required.

The system currently manages:

- **1,897 entities** across 30 domains
- **66 automations**
- **20 defined areas** covering every room in the house
- **884 sensors** (most of these are device telemetry, but a good chunk are custom)

## Design Philosophy

The goal is simple: **Safe, Reliable, and Easy to Use.** Not impressive to demo, not packed with features for their own sake — a system that the whole family can operate without thinking about it, that doesn't fail in ways that are hard to recover from, and that doesn't introduce risk into the home. Every decision below traces back to one of those three.

**Everything runs local — no cloud, no exceptions.** Nothing in this system phones home to work. No Samsung account, no Shelly Cloud, no Alexa in the middle. If the internet goes down, every light, sensor, and automation keeps running exactly as it did before. This isn't just a privacy preference — it's reliability. Cloud-dependent devices break when the manufacturer changes their API, sunsets an app, or simply goes under. Local-first means the system is under your control indefinitely.

**Open source for anything with an IP address.** If a device runs on WiFi or ethernet, it runs open firmware where possible. Shelly modules run ESPHome. ESP32 boards run ESPHome. Open firmware is what makes the local-first principle stick — you're not dependent on the manufacturer to keep their app or cloud running, and you're not locked out if they decide to start charging for features that used to be free.

**Zigbee for anything battery-powered.** WiFi is power-hungry; Zigbee is not. Sensors, buttons, and remotes that run on batteries are all Zigbee — they sleep between transmissions, lasting one to two years on a single battery. No battery device in this house is trying to maintain a WiFi connection.

**Hardware is matched to the installation type.** This isn't just about preference — it's about safety and fit:

- **Sonoff S31** for wall outlet plugs. UL listed, fits a standard outlet, controls whatever is plugged in.
- **Shelly Plus 1** for inside the gang box, wired in-line. Also UL listed, fits behind an existing wall switch without replacing the switch plate.

**The Zigbee coordinator is abstracted.** The **SLZB-06** sits on the network as a standalone device rather than a USB dongle plugged directly into the Pi. This matters: if the Pi fails and needs to be replaced, the Zigbee network keeps running. Swap the Pi, point the new install at the SLZB-06, and the 53 Zigbee devices never know anything happened.

**Automations are event-driven — both directions.** A common beginner mistake is automating the "on" condition and using a timer for the "off." Here, automations respond to events in both directions — a door closing, motion clearing, a sensor changing state, a person leaving a zone. The system reacts to what actually happened, not to what a countdown assumed would happen.

**The hardware is modular by design.** The Pi runs from an **SSD** rather than an SD card — faster, more reliable, and swappable in minutes if it fails. Long-term sensor history is stored in a SQL database rather than HA's default SQLite recorder, keeping historical data intact across reinstalls.

A **Sonoff S31** plug acts as an external hardware watchdog for the Pi. If the Pi stops responding, it cuts and restores power — a hard reset that no amount of software can prevent.

**If the right sensor doesn't exist, build it.** A meaningful number of the devices and sensors in this system are custom-built or modified — ESP32 boards wired to non-standard sensors, commercial devices reflashed with open firmware, purpose-built enclosures for specific spots in the house.

**Floorplan is the primary dashboard.** Rather than a grid of cards, the main control interface is an interactive floorplan of the house. Lights, sensors, and switches are mapped to their physical locations — tap a room to control it, glance at the map to see what's on.

## Motion-Activated Lighting

Nearly every secondary space in the house has motion-activated lighting. Rooms with motion lighting include the Basement, Butler Pantry, Laundry Room, Furnace Room, Front and Rear Hallways, Front Bathroom, Garage, Living Room, and Family Room.

Several of these use **luminosity thresholds** — they only activate at night or when ambient light is already low. No lights snapping on in a sun-drenched hallway at noon.

## Shelly Relays Running ESPHome

Most of the light switching throughout the house is handled by **Shelly Plus 1** modules — small single-relay boards that wire in behind an existing wall switch. The original switch stays on the wall and still works physically; the Shelly sits behind it and also makes it controllable from HA.

These aren't running Shelly's stock firmware. They're all flashed with **ESPHome** — fully local, zero-cloud, no Shelly account required.

| Area           | Circuits                                                                |
| -------------- | ----------------------------------------------------------------------- |
| Basement       | Northeast, Northwest, Southeast, Southwest (4 zones) + Lab              |
| Living Room    | Ceiling lamp, floor lamp, main lights, Christmas tree, Christmas window |
| Family Room    | Ceiling light, floor lamp                                               |
| Garage         | Main ceiling, shop ceiling                                              |
| Office         | Wall light, sofa lamp                                                   |
| Hallways       | Front, rear, upper                                                      |
| Laundry Room   | Ceiling light, washing machine outlet                                   |
| Butler Pantry  | Ceiling light                                                           |
| Furnace Room   | Ceiling light                                                           |
| Front Bathroom | Lights                                                                  |
| Kid's Room     | Beacon light                                                            |

**Double-tap detection** — ESPHome can detect a fast double-press of the physical wall switch as a separate event. In the hallways, basement, office, and laundry room, a quick double-tap triggers a different action than a single flip — typically toggling a group, triggering a scene, or firing an automation. The wall switch becomes a two-function controller without any hardware changes.

## The Office: A Room That Pays Attention

The office has more automation logic than any other room, built around one idea: the room should know whether I'm working and respond accordingly.

**Reflected lighting** — four independently controllable LED strips pointed at the walls (East Warm, East White, West Warm, West White), tuned for different modes throughout the day.

**Seat detection** — a pressure sensor under the chair feeds into a binary helper that tracks whether the seat is occupied. Sitting still at a desk doesn't generate much motion, so without the seat sensor, the lights would time out mid-work. The sensor is a custom mod — a battery-powered Zigbee door sensor with the reed switch replaced by a car seat airbag pressure sensor.

**Guest Mode** — a house-wide toggle that shifts certain behaviors when company is over. Auto-expires at 2am so it's never accidentally left on overnight.

**Wand controls** — MagiQuest wands have been repurposed as home automation controllers. The wands are infrared — when flicked or swished, they emit an IR signal containing the wand's unique serial number. Custom-built ESP32 devices with IR receivers decode the serial and fire the corresponding automation. Each wand is individually identified. Waving a wand controls holiday lighting, the Christmas tree, color effects, or any scene — and it actually looks like magic.

## Kids Digital Curfew

The dashboard gives parents direct control over the router's digital curfew. The family's OpenWRT router blocks internet access for specific devices on a schedule, controlled entirely from HA. Four independent groups cover kids' devices, the Roku, a teen's PC, and the family room TV.

The HA side is template switches that call a CGI script on the router via REST. Status is polled every 60 seconds and displayed as toggle tiles on a parent-only dashboard panel. See the [Digital Curfew](/projects/networking/internet-curfew/) project for full implementation details.

## Presence and Arrival Automation

The house knows when people come and go. When a family member arrives home, a notification fires. When a specific person arrives, the garage door opens automatically. These use HA's built-in zone system with phone GPS tracking.

The family room uses an **mmWave presence sensor** (ESP32-based) rather than a simple PIR sensor. mmWave detects stationary occupancy — someone sitting still reading or watching TV — not just movement.

## Water and Appliance Monitoring

**Water leak sensors** cover the furnace room (AC condensation drain) and under the kitchen dishwasher.

**Refrigerator door** — a sensor monitors the left door and if left ajar, the whole house flashes its lights. Hard to miss, avoiding an accidental great thaw by morning.

**Freezer temperature** — notification fires before food is at risk.

**Toilet tank** — an automation watches for the tank to stop refilling within the expected window, catching a stuck flapper or running toilet. The sensor is another custom mod: a battery-powered Zigbee door sensor with its reed switch replaced by a float switch inside the tank. No wall power, just a small Zigbee device inside the tank lid.

## Holiday Automation

A water level sensor in the Christmas tree stand monitors the reservoir and sends a notification when it needs refilling. A separate sensor tracks the pet water bowl. Both are modified Zigbee leak detectors with extended probes, mounted in custom 3D printed holders.

The tree lights are on an automation — scheduled power, with a wand trigger for manual control during the season.

## Robot Vacuum

The **DreameBot L10s Ultra** is integrated with Home Assistant. HA monitors state, task status, charging status, auto-empty status, self-wash base status, and cleaning count — useful for automations that shouldn't run while the vacuum is active.

## Infrastructure and Self-Monitoring

**Zigbee device offline alerts** — an automation periodically checks for devices that have gone offline or stopped reporting. Useful for catching dead batteries without having to notice manually.

**Unavailable entity count** — a sensor tracks how many entities are currently unavailable. Spikes are an early signal that something went wrong.

**Watchman** — an add-on that scans automations and scripts for references to entities or services that no longer exist. Catches dangling references before they silently break automations.

**HA startup and shutdown notifications** — two automations fire when HA starts and stops. Simple, but useful for knowing when the system rebooted unexpectedly.

## Cat Treats

Yes. There is an automation called `Cat Treats Feed`. It's exactly what it sounds like. Several Zigbee buttons throughout the home and timed automations provide tasty distractions.

## What Makes It Work

None of this is magic — it's a lot of small decisions made consistently. Every room has an area assigned. Every device has a name that describes what it actually is. Automations are named for what they do, not what triggered them. The result is a system that's navigable six months later, when you've forgotten why you built something.

**The stack:**

- **Hardware:** Raspberry Pi 4, SLZB-06 Zigbee coordinator, Shelly Plus 1 (ESPHome firmware), Sonoff S31, Tuya Zigbee sensors/buttons, Apollo mmWave sensors, ESPHome ESP32 devices
- **Software:** Home Assistant OS 2026.3.2, ZHA integration, Zigbee2MQTT, ESPHome, Watchman
- **Protocols:** Zigbee (primary), WiFi (Shelly/Sonoff/ESPHome), REST (router integration)
