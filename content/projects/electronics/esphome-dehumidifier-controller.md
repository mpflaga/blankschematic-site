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
summary: "A basement dehumidifier whose built-in control restarts the compressor within 30 seconds of finishing a cycle. Two ESP boxes replace that with a wide, adjustable deadband and an anti-short-cycle timer — no Home Assistant, no cloud. Now with a third, router-free config pair for buildings with no Wi-Fi at all."
---

## The problem

A dehumidifier in a basement has a humidistat knob, and behind that knob is
a control with almost no hysteresis. It reaches setpoint, shuts the compressor
off, and about thirty seconds later — as soon as the air near the sensor drifts
back up a fraction of a percent — it starts it again. All day. The compressor
short-cycles, which is hard on it (every start is an inrush surge and a
high-head restart if the refrigerant pressures haven't equalised yet) and it
wastes energy running near-continuously to hold a number tighter than the room
actually needs.

For a basement, a **5–15 %RH swing is completely fine**. Precision isn't the
goal here — *not restarting the compressor every thirty seconds* is the goal.

## The fix, in one sentence

Replace the built-in control with a **wide, adjustable deadband** (turn on at
60 %RH, off at 50 %, hold in between) plus an **anti-short-cycle minimum-off
timer** so the compressor gets a guaranteed rest between cycles. Fewer starts,
less wear, lower energy use.

## Why two boxes

```text
 SHT41  ──I²C──▶  ESP32  ──Wi-Fi──▶  Sonoff S31  ──mains──▶  Dehumidifier
 humidity         Box A               Box B
                  reads RH,           switches the load,
                  runs the logic      enforces compressor limits
```

**Box A** — a Wemos ESP32 with a Sensirion SHT41 humidity sensor — is the
brain. It reads the room, runs the deadband and the timers, and decides whether
the dehumidifier should be running. It is low-voltage only and never goes near
mains.

**Box B** — a **Sonoff S31**, an ETL-listed smart plug — does the actual 120 VAC
switching. That's the whole reason for splitting it: all the mains wiring,
fusing, and creepage distance lives inside a certified appliance. I flash it
with new firmware, but I never open its high-voltage side or wire an outlet.

The S31 specifically because it hits every requirement at once: it's
**ETL-listed**, so the mains engineering is already done and certified; the
ESP module inside is reachable through a header for reflashing **without
cutting into or otherwise destructively modifying the case**; and it's cheap
enough that a certified, relay-switched, ESP-controlled outlet costs less
than sourcing a bare relay and enclosure separately.

The two boxes talk to each other over plain HTTP on the house Wi-Fi. **No Home
Assistant, no MQTT, no broker, no cloud.** The controller `POST`s
`/switch/relay/turn_on` (or `turn_off`) to the plug every 20 seconds — not just
on a change, so if the plug reboots it re-syncs within one cycle. Each box also
raises its own Wi-Fi hotspot and captive portal on first boot, so the pair can
be handed to someone else and onboarded onto a network I've never seen.

## The guard rails

There are two versions of each config. The **simple** pair is one
self-contained file each — deadband, min-off timer, and nothing else — meant
for reading and explaining. The **full** pair adds the parts that matter when
this is switching a real compressor unattended:

- **Compressor cool-off on the plug.** After the relay opens, the plug refuses
  any turn-on for a configurable window (default 5 min). This lives on the
  *plug*, not the controller, and the controller **cannot** override it. If the
  brain does something stupid, the mains side still protects the compressor.
- **Power-on delay.** An ESP with no synced clock can't measure how long it was
  unpowered. So after the plug itself loses power, it assumes the worst and
  holds off the first turn-on for a few minutes — with a clearly-labelled
  "force" button on the plug's own page for the "it's been off all night, just
  start it" case.
- **Stale-command watchdog.** If the plug hasn't heard from the controller in
  15 minutes, it forces the relay off. A dehumidifier stuck *on* because the
  brain died is exactly the failure the mains side has to catch on its own.
- Dead-sensor lockout, HTTP Basic auth on the relay endpoint, and a
  human-readable last-command status (`OK` / `AUTH FAILED` / `UNREACHABLE` /
  `HTTP ERROR n`) on the controller's page.

## The web UIs

Both boxes run ESPHome's built-in web server, with the live log streaming
alongside the entity table. IPs and MACs blurred out below, but everything
else is real: the plug's cool-off/power-on-delay/watchdog fields, and the
controller's deadband and humidity reading.

![Dehumidifier Plug web UI, showing the cool-off, power-on delay, and stale-command watchdog fields](/images/projects/esphome-dehumidifier-plug-webui.png)

![Dehumidifier Controller web UI, showing the deadband setpoints, live humidity reading, and plug IP field](/images/projects/esphome-dehumidifier-controller-webui.png)

## Load and relay rating — the honest caveat

The S31's relay is rated for a **resistive** load. A dehumidifier is a
**compressor (motor) load**, and motor loads are harder on relay contacts in
two ways: the inrush/locked-rotor current at start is several times the running
current, and relay makers publish a lower rating for motor loads than the
headline resistive figure. Before wiring a real unit through it: read the
dehumidifier's nameplate running current, check it against the S31's label,
and if it's anywhere near the limit, drive a properly-rated contactor from the
S31 instead. The anti-short-cycle timer helps here too — fewer make/break
cycles under load means slower contact erosion.

## How it's verified

- **CI** compiles all four configs against the current ESPHome release on every
  push, and again on a weekly schedule so a breaking release shows up as a red
  X instead of an email from a stranger.
- The full pair was **bench-tested end to end** on real hardware (bare S31, no
  load): deadband both directions, the full cool-off cycle, the force button,
  and the stale-command watchdog (I unplugged the controller and watched the
  relay drop). The
  [test log](https://github.com/blankschematic/esphome-dehumidifier-controller/blob/main/TESTING.md)
  records what passed and what wasn't covered.

## No Wi-Fi in the building? There's a variant for that now

The setup above did its job — until the wrinkle every real install eventually
throws at you: **the target buildings are vacant.** No occupants, no router,
no Wi-Fi — the "join your home network" step the whole design assumed doesn't
exist there. The original pair needs *some* Wi-Fi to talk to each other over,
even if it's never used for anything else.

So there's now a third config pair — `dehumidifier-controller-isolated.yaml` /
`dehumidifier-plug-isolated.yaml` — that needs no router at all. Same
deadband, same cool-off timer, same watchdog, same web UI. Only the network
layer is different.

### One box brings its own Wi-Fi

Instead of both boxes joining a network that doesn't exist, one of them
**becomes** the network. The other joins it directly. No internet, no router,
no captive-portal onboarding dance — the link credentials are baked into the
firmware at build time, because there's no "unknown Wi-Fi you'll hand this to
a stranger" step to design around anymore; these are your two boxes, in your
building. To manage the pair, you join *that* Wi-Fi network with a phone,
same as joining any router — except this router is a Sonoff plug sitting in a
basement.

### The wrong way first

The obvious layout: put the access point on the **controller** — it's the
brain, it's the ESP32 with the beefier radio, it felt right. It compiled
clean, it flashed clean, the AP came up, the plug joined it and got an IP.

And then nothing talked. The controller's `Last command outcome` sat on
`UNREACHABLE` forever, and its log was blunt about why:

```text
[E][http_request.idf:057]: HTTP Request failed; Not connected to network
```

Turns out ESPHome's `http_request` component flatly refuses to send anything
unless the device has an active **station** (client) Wi-Fi connection — it
doesn't count "I'm hosting an access point with clients on it" as being
connected to a network. There's no config flag to override this; it's just how
the component checks connectivity.

The controller is the box that POSTs the relay commands. So the controller has
to be the station. Which means the **plug** has to be the one hosting the
access point:

```text
   phone ──┐  join the link Wi-Fi
           ▼
   ┌──────────────────┐   POST /switch/relay/…   ┌─────────────────────┐
   │ Plug (S31)        │ ◀─────────────────────── │ Controller (ESP32)  │
   │ hosts the AP       │                          │ joins as a station  │
   │ web UI @ .4.1     │ ──────────────────────▶  │ web UI @ .4.2       │
   └──────────────────┘   200 / 401 / timeout    └─────────────────────┘
```

Flip that, and it works. This is the kind of thing that's obvious in hindsight
and invisible until you actually try it — which is the whole reason for
writing it down here instead of just quietly fixing it.

### Bench result

Flashed both over serial, joined the link network with a phone:

- Controller found the plug's access point, got its address, and every
  ~20-second re-assert cycle came back `OK`.
- Forced a threshold crossing (temporarily dropped the setpoints below the
  actual room humidity) and watched the whole chain fire for real: desired
  state flips, the plug's cool-off timer counts down, and once it clears, the
  relay actually closes. Then reversed it and watched the relay drop again.
- Added a signal-strength sensor to the controller's page (`Wi-Fi signal to
  plug`, in dBm) so there's a real number to check once a pair is installed at
  actual basement distance instead of sitting inches apart on a bench.

The plug's own IP (`.4.1`) and the controller's (`.4.2`) are the isolated
link's own self-hosted addresses, not a home network — they show up as-is
below since that's exactly what the diagram above is describing:

![Dehumidifier Plug web UI on the isolated link, showing the cool-off timer counting down after a bench-forced relay cycle](/images/projects/esphome-dehumidifier-isolated-plug-webui.png)

![Dehumidifier Controller web UI joined to the plug's access point as a station, with the live log streaming HTTP request traffic](/images/projects/esphome-dehumidifier-isolated-controller-webui.png)

Full write-up, wiring, and the "why" behind every decision is in the
[README's isolated-link section](https://github.com/blankschematic/esphome-dehumidifier-controller#no-wi-fi-in-the-building-the-isolated-link-pair).
The verification log — what's confirmed on hardware and what's still open — is
in [TESTING.md](https://github.com/blankschematic/esphome-dehumidifier-controller/blob/main/TESTING.md).

### What didn't need to change

The deadband math, the anti-short-cycle timer, the compressor cool-off, the
power-on delay, the stale-command watchdog, the auth — all of it is the exact
same code as the router-based pair, byte for byte. It got pulled out into two
shared files (`packages/controller-logic.yaml`, `packages/plug-logic.yaml`) so
a future fix lands on both variants at once instead of needing to be
copy-pasted a third time. The only new code is the two small network packages
that decide who hosts and who joins.

### Still open

- Haven't yet pushed a firmware update *over* the isolated link itself (this
  round of flashing was all over USB).
- Haven't yet pulled the plug's power mid-test to confirm the controller's own
  recovery access point comes up cleanly.

Neither is a new risk — both reuse mechanisms already proven elsewhere in the
project — just not yet watched happen on this specific pair.

## Getting it

The [repo](https://github.com/blankschematic/esphome-dehumidifier-controller)
has all six configs (router-based, simple, and isolated-link, each as a
controller/plug pair) and a full README.
[Release v1.0.0](https://github.com/blankschematic/esphome-dehumidifier-controller/releases/tag/v1.0.0)
has pre-built firmware — flash it over serial, or straight from a browser with
the included ESP Web Tools manifest. Bring your own Wi-Fi Sonoff S31 (or S31
Lite) and an ESP32 with an SHT4x sensor.
