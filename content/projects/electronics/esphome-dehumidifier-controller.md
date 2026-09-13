---
title: "A Wide Deadband for a Short-Cycling Basement Dehumidifier"
date: 2026-09-08
categories: [electronics]
tags: [esphome, esp32, esp8266, sonoff, humidistat, hvac]
github: "https://github.com/blankschematic/esphome-dehumidifier-controller"
github2: "https://github.com/blankschematic/esphome-dehumidifier-controller/releases/tag/v1.0.0"
github2label: "v1.0.0 — firmware & browser install ↗"
status: complete
cover: /images/projects/esphome-dehumidifier-controller.jpg
photos: "https://photos.app.goo.gl/2Q6iRifWbn8ioNWV8"
summary: "A basement dehumidifier whose built-in control restarts the compressor within 30 seconds of finishing a cycle. Two ESPHome boxes replace that with a wide, adjustable deadband and an anti-short-cycle timer — no Home Assistant, no cloud. Ships as three config pairs: a learning-only simple pair, a full pair for a home Wi-Fi network, and a full pair for buildings with no Wi-Fi at all."
---

## The problem

A dehumidifier's built-in humidistat has almost no hysteresis: it shuts the
compressor off at setpoint, and about thirty seconds later — as soon as the
air near the sensor drifts back up a fraction of a percent — it starts it
again. All day. The compressor short-cycles, which is hard on it (every start
is an inrush surge and a high-head restart if the refrigerant pressures
haven't equalised yet) and it wastes energy holding a number tighter than a
basement actually needs. A 5–15 %RH swing is fine down there; the goal isn't
precision, it's *not restarting the compressor every thirty seconds*.

## The solution

Two ESPHome boxes replace the built-in control: one reads humidity and runs a
**wide, adjustable deadband** (on at 60 %RH, off at 50 %) plus an
**anti-short-cycle minimum-off timer**; the other switches the dehumidifier's
mains power. They talk over plain local HTTP — no Home Assistant, no MQTT, no
broker, no cloud.

It ships as three config pairs, for three different situations:

| Pair | Purpose | Guard rails |
|---|---|---|
| **Simple** | Reading the core mechanism — one small file per box | None |
| **Full, Wi-Fi** | A real install on a network that already exists | Full |
| **Full, isolated-link** | A real install in a building with no Wi-Fi at all | Full |

The simple pair is deadband and timer only, meant to be read end to end. The
two full pairs add the same set of guard rails described below and are
identical in every way except the network layer — pick whichever matches
whether the building has Wi-Fi to join.

## Architecture: two boxes, two jobs

```text
 SHT41  ──I²C──▶  ESP32  ──Wi-Fi──▶  Sonoff S31  ──mains──▶  Dehumidifier
 humidity         Box A               Box B
                  reads RH,           switches the load,
                  runs the logic      enforces compressor limits
```

**Box A**, the controller — a Wemos ESP32 with a Sensirion SHT41 humidity
sensor — reads the room, runs the deadband and the timers, and decides
whether the dehumidifier should be running. It is low-voltage only and never
goes near mains.

**Box B**, the plug — a **Sonoff S31**, an ETL-listed smart plug — does the
actual 120 VAC switching. Splitting the design this way keeps all mains
wiring, fusing, and creepage distance inside a certified appliance; the S31's
firmware gets replaced, but its high-voltage side is never opened.

The S31 specifically because it hits every requirement at once: it's
**ETL-listed**, so the mains engineering is already done and certified; the
ESP module inside is reachable through a header for reflashing **without
cutting into or otherwise destructively modifying the case**; and it's cheap
enough that a certified, relay-switched, ESP-controlled outlet costs less
than sourcing a bare relay and enclosure separately.

The controller `POST`s `/switch/relay/turn_on` (or `turn_off`) to the plug
every 20 seconds — not just on a change, so a plug reboot re-syncs within one
cycle.

## The guard rails

Both full pairs add the parts that matter when this is switching a real
compressor unattended:

- **Compressor cool-off, enforced on the plug.** After the relay opens, the
  plug refuses any turn-on for a configurable window (default 5 min). This
  lives on the *plug*, not the controller, so a bug on the brain's side
  cannot bypass it — the mains side protects the compressor independently.
- **Power-on delay.** An ESP with no synced clock can't measure how long it
  was unpowered, so after the plug itself loses power, it holds off the
  first turn-on for a few minutes by default. A clearly-labelled "force"
  button on the plug's own page covers the "it's been off all night, just
  start it" case.
- **Stale-command watchdog.** If the plug hasn't heard from the controller in
  15 minutes, it forces the relay off — catching a dehumidifier stuck *on*
  because the brain died, on the mains side where it has to be caught.
- Dead-sensor lockout, HTTP Basic auth on the relay endpoint, and a
  human-readable last-command status (`OK` / `AUTH FAILED` / `UNREACHABLE` /
  `HTTP ERROR n`) on the controller's page.

## Network layer: with Wi-Fi, or without

The **Wi-Fi pair** joins the building's existing network and talks to each
other over it, same as any two IoT devices on a LAN. Each box also raises its
own hotspot and captive portal on first boot for onboarding.

The **isolated-link pair** is for buildings with no router at all — vacant
buildings, mainly. Instead of both boxes joining a network that doesn't
exist, one of them **becomes** the network and the other joins it directly.
There's no internet, no router, and no captive-portal onboarding dance —
the link credentials are baked into the firmware at build time, since these
are always your own two boxes, never an unknown network handed to a stranger.
Managing the pair means joining that Wi-Fi network with a phone, same as
joining any router — except this router is a Sonoff plug.

The access point has to live on the **plug**, not the controller, even
though the controller is the more capable radio. ESPHome's `http_request`
component only sends a request when the device has an active **station**
(client) connection; it doesn't count "hosting an access point with clients
on it" as being connected to a network, and there's no config flag to
override that. Since the controller is the box that `POST`s the relay
commands, it has to be the station — which puts the access point on the
plug:

```text
   phone ──┐  join the link Wi-Fi
           ▼
   ┌──────────────────┐   POST /switch/relay/…   ┌─────────────────────┐
   │ Plug (S31)        │ ◀─────────────────────── │ Controller (ESP32)  │
   │ hosts the AP       │                          │ joins as a station  │
   │ web UI @ .4.1     │ ──────────────────────▶  │ web UI @ .4.2       │
   └──────────────────┘   200 / 401 / timeout    └─────────────────────┘
```

Wired the other way around, the controller's `Last command outcome` sits on
`UNREACHABLE` permanently:

```text
[E][http_request.idf:057]: HTTP Request failed; Not connected to network
```

Everything else — the deadband math, the anti-short-cycle timer, the
compressor cool-off, the power-on delay, the stale-command watchdog, the
auth — is the exact same code as the Wi-Fi pair, byte for byte. It lives in
two shared files (`packages/controller-logic.yaml`,
`packages/plug-logic.yaml`) so a fix lands on both network variants at once.
The only code that differs between them is the two small network packages
that decide who hosts and who joins.

## Testing and validation

- **CI** compiles all six configs against the current ESPHome release on
  every push, and again on a weekly schedule, so a breaking release shows up
  as a red X instead of an email from a stranger.
- Both full pairs were **bench-tested end to end** on real hardware (bare
  S31, no load): deadband in both directions, the full cool-off cycle, the
  force button, and the stale-command watchdog (unplugging the controller and
  watching the relay drop). On the isolated-link pair specifically: the
  controller found the plug's access point and every ~20-second re-assert
  came back `OK`, and a forced threshold crossing drove the relay through a
  full on/cool-off/off cycle.
- The [test log](https://github.com/blankschematic/esphome-dehumidifier-controller/blob/main/TESTING.md)
  records what's confirmed on hardware and what isn't yet: a firmware update
  pushed *over* the isolated link itself (all flashing so far has been over
  USB), and pulling the plug's power mid-test to confirm the controller's own
  recovery access point comes up cleanly. Both reuse mechanisms already
  proven elsewhere in the project; neither has been watched happen on this
  specific pair yet.

Both boxes run ESPHome's built-in web server, with the live log streaming
alongside the entity table. IPs and MACs are blurred below; everything else
is real.

**Wi-Fi pair:**

![Dehumidifier Plug web UI, showing the cool-off, power-on delay, and stale-command watchdog fields](/images/projects/esphome-dehumidifier-plug-webui.png)

![Dehumidifier Controller web UI, showing the deadband setpoints, live humidity reading, and plug IP field](/images/projects/esphome-dehumidifier-controller-webui.png)

**Isolated-link pair** — `.4.1` and `.4.2` are the link's own self-hosted
addresses, not a home network, which is why they're shown as-is rather than
blurred:

![Dehumidifier Plug web UI on the isolated link, showing the cool-off timer counting down after a bench-forced relay cycle](/images/projects/esphome-dehumidifier-isolated-plug-webui.png)

![Dehumidifier Controller web UI joined to the plug's access point as a station, with the live log streaming HTTP request traffic](/images/projects/esphome-dehumidifier-isolated-controller-webui.png)

Full wiring notes and the reasoning behind each guard rail are in the
[README](https://github.com/blankschematic/esphome-dehumidifier-controller),
including a dedicated
[isolated-link section](https://github.com/blankschematic/esphome-dehumidifier-controller#no-wi-fi-in-the-building-the-isolated-link-pair).

## Subtle features

A few details that don't fall out of the config at a glance:

- The plug, not the controller, hosts the access point on the isolated-link
  pair — a direct consequence of ESPHome's `http_request` requiring an
  active station connection (see above), not an arbitrary choice.
- The controller's 20-second re-assert is idempotent by design: it resends
  the desired state on every cycle rather than only on a change, so a plug
  reboot resyncs on its own within one cycle instead of needing a nudge.
- The compressor cool-off timer is enforced on the plug specifically so that
  a bug or a bad decision on the controller's side physically cannot
  shorten it — the mains-side guard rail doesn't trust the brain.
- A Wi-Fi signal-strength sensor (`Wi-Fi signal to plug`, in dBm) on the
  controller's page gives a real number to check once a pair is installed at
  actual basement distance, rather than sitting inches apart on a bench.
- The S31's relay is rated for a **resistive** load; a dehumidifier is a
  **compressor (motor) load**, with inrush/locked-rotor current several
  times the running current and a correspondingly lower motor-load rating
  from the relay's manufacturer. Before wiring a real unit through it: check
  the dehumidifier's nameplate running current against the S31's label, and
  drive a properly-rated contactor from the S31 instead if it's anywhere
  near the limit. The anti-short-cycle timer helps here too — fewer
  make/break cycles under load means slower contact erosion.

## Getting it

The [repo](https://github.com/blankschematic/esphome-dehumidifier-controller)
has all six configs (simple, Wi-Fi, and isolated-link, each as a
controller/plug pair) and a full README.
[Release v1.0.0](https://github.com/blankschematic/esphome-dehumidifier-controller/releases/tag/v1.0.0)
has pre-built firmware — flash it over serial, or straight from a browser with
the included ESP Web Tools manifest. Bring your own Wi-Fi Sonoff S31 (or S31
Lite) and an ESP32 with an SHT4x sensor.
