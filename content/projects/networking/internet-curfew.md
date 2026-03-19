---
title: "Per-Device Internet Curfew with nftables + Home Assistant"
date: 2025-01-20
categories: [networking, home-assistant]
tags: [openwrt, nftables, parental-controls, firewall, rest, cgi, shell]
status: complete
summary: "Blocks internet access per-device on a schedule using OpenWRT nftables rules, with a Home Assistant dashboard toggle for manual overrides — no third-party apps or cloud dependency."
---

## Overview

A fully local, cloud-free parental internet curfew built on two components: OpenWRT enforces the actual firewall rules, and Home Assistant provides the dashboard toggle for parents to enable or disable curfew on demand. No third-party app, no subscription — just nftables, a small CGI script, and a REST sensor.

## Architecture

```
[HA Dashboard Toggle]
        ↓
[HA REST command → OpenWRT CGI]
        ↓
[nftables rule add / remove]
        ↓
[Kids' devices blocked / unblocked]
```

## OpenWRT Side

### CGI API — `/www/cgi-bin/curfew`

A shell script served by `uhttpd`. Accepts POST requests with `action` and `key` params. Authenticates via a shared API key, then dispatches to the appropriate helper script.

Supported actions: `enable` | `disable` | `status`

### MAC List — `/usr/bin/curfew-macs.sh`

Defines `$CURFEW_MACS` — the list of kids' device MAC addresses that all firewall rules target. Keeping the MAC list in one file means it's easy to add or remove devices without touching the rule logic.

### Curfew Rules — `/usr/bin/curfew-enable.sh`

Adds three rules to the `inet fw4 forward` chain. All rules are idempotent — the script exits cleanly if they're already present:

| Rule | Comment | Effect |
|---|---|---|
| Overnight | `Curfew-Every-Morning` | Blocks 12:00 am – 7:00 am daily |
| School nights | `Curfew-SchoolNight-Late` | Blocks 11:00 pm – 11:59 pm Sun–Thu |
| Friday daytime | `Curfew-Friday-08to15` | Blocks 8:00 am – 3:00 pm Fridays |

### Disable — `/usr/bin/curfew-disable.sh`

Dynamically looks up each rule's handle number by its comment name and deletes it. No hardcoded handle IDs means it survives reboots and rule order changes.

### Status — `/usr/bin/curfew-status.sh`

Returns `{"curfew":"on"}` or `{"curfew":"off"}` by checking whether `Curfew-Every-Morning` is present in the chain.

### Boot Persistence — `/etc/init.d/curfew-rules`

Runs `curfew-enable.sh` at boot (`START=99`) so rules are automatically restored after a router reboot.

## Home Assistant Side

### `configuration.yaml` — REST commands + status sensor

| Item | Purpose |
|---|---|
| `rest_command.curfew_enable` | POSTs `action=enable` to the OpenWRT CGI endpoint |
| `rest_command.curfew_disable` | POSTs `action=disable` to the OpenWRT CGI endpoint |
| `command_line` sensor: *Curfew Status* | POSTs `action=status` every 60 s, parses JSON → `sensor.curfew_status` |

### `templates.yaml` — Template switch

`switch.kids_curfew`:

- **State:** mirrors `sensor.curfew_status == 'on'`
- **Icon:** `mdi:shield-lock` when on / `mdi:shield-off-outline` when off
- **Turn on:** calls `rest_command.curfew_enable` → waits 1 s → refreshes sensor
- **Turn off:** calls `rest_command.curfew_disable` → waits 1 s → refreshes sensor

### Dashboard

A tile card on the parents' dashboard, visible only to authorized parent accounts via a conditional user check. Gives a quick on/off toggle without requiring access to the router admin UI.
