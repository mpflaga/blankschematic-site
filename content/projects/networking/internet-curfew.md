---
title: "Per-Device Internet Curfew with nftables + Home Assistant"
date: 2025-01-20
categories: [networking, home-assistant]
tags: [openwrt, nftables, parental-controls, firewall, rest, cgi, shell]
cover: /images/projects/internet-curfew.webp
status: complete
summary: "Blocks internet access per-device on a schedule using OpenWRT nftables rules, with a Home Assistant dashboard toggle for manual overrides — no third-party apps or cloud dependency."
---

## Overview

The problem: kids hiding under the covers with a tablet or sneaking downstairs to watch TV until 4 AM. The solution: cut the internet to their devices on a schedule, with a quick toggle on the parents' dashboard to restore or enforce it on demand — no negotiations, no excuses.

Built entirely local and cloud-free. OpenWRT enforces the actual firewall rules, and Home Assistant provides the dashboard toggle. No third-party app, no subscription, no calling home — just nftables, a small CGI script, and a REST sensor.

Rules target devices at **Layer 2 by MAC address**, which means they work regardless of IP assignment, VLAN membership, or connection type — a device is blocked whether it's on Wi-Fi, wired Ethernet, or roams between them, and DHCP lease renewals don't help.

## Curfew Groups

| Group | Schedule |
|-------|----------|
| Kids devices | 12 am–7 am nightly, 11 pm–midnight Sun–Thu, 8 am–3 pm Fridays |
| Downstairs Roku | Same as above |
| Teen's PC | Manual block only — auto-disables at 7 am if left on |
| Family Room TV | Manual block only — auto-disables at 7 am if left on |

Scheduled groups are restored at boot. Manual-only groups are intentionally not re-enabled after a reboot.

## Architecture

```
[HA Dashboard Toggle]
        ↓
[HA REST command → OpenWRT CGI]
        ↓
[nftables rule add / remove]
        ↓
[Devices blocked / unblocked]
```

## OpenWRT Setup

### 1. Generate an API Key

Generate a random key to authenticate requests from HA to the router:

```sh
cat /dev/urandom | tr -dc 'A-F0-9' | head -c 64
```

Use this key everywhere `YOUR_API_KEY` appears below.

### 2. MAC List Files

One file per group defines the `$CURFEW_MACS` variable in nftables set syntax:

```sh
# /usr/bin/curfew-macs-kids.sh
#!/bin/sh
CURFEW_MACS="{ aa:bb:cc:dd:ee:01, aa:bb:cc:dd:ee:02, aa:bb:cc:dd:ee:03 }"
```

Repeat for each group (`curfew-macs-roku.sh`, `curfew-macs-teen.sh`, `curfew-macs-tv.sh`).

> **Finding MAC addresses:** Check `/tmp/dhcp.leases` on the router or your router's DHCP client list.

### 3. Enable Script — `/usr/bin/curfew-enable.sh`

Adds nftables rules per group. All adds are idempotent — exits cleanly if rules are already present.

Scheduled groups (kids, Roku) get three time-window rules. Manual groups (teen PC, TV) get a single blanket block rule.

```sh
#!/bin/sh
GROUP="${1:-kids}"

case "$GROUP" in
  kids) . /usr/bin/curfew-macs-kids.sh; CHECK="Kids-Every-Morning" ;;
  roku) . /usr/bin/curfew-macs-roku.sh; CHECK="Roku-Every-Morning" ;;
  teen) . /usr/bin/curfew-macs-teen.sh; CHECK="Teen-Curfew-Block" ;;
  tv)   . /usr/bin/curfew-macs-tv.sh;   CHECK="TV-Curfew-Block" ;;
  *) logger -t curfew "ERROR: unknown group '$GROUP'"; exit 1 ;;
esac

if nft list chain inet fw4 forward | grep -q "$CHECK"; then
  logger -t curfew "SKIP: $GROUP already enabled"; exit 0
fi

if [ "$GROUP" = "kids" ] || [ "$GROUP" = "roku" ]; then
  PREFIX=$(echo "$GROUP" | sed 's/./\u&/')  # capitalize
  nft add rule inet fw4 forward ether saddr $CURFEW_MACS \
    meta hour "00:00"-"07:00" counter drop comment "${PREFIX}-Every-Morning"
  nft add rule inet fw4 forward ether saddr $CURFEW_MACS \
    meta day { "Sunday","Monday","Tuesday","Wednesday","Thursday" } \
    meta hour "23:00"-"23:59" counter drop comment "${PREFIX}-SchoolNight-Late"
  nft add rule inet fw4 forward ether saddr $CURFEW_MACS \
    meta day "Friday" meta hour "08:00"-"15:00" counter drop comment "${PREFIX}-Friday-08to15"
else
  case "$GROUP" in
    teen) PREFIX="Teen" ;; tv) PREFIX="TV" ;;
  esac
  nft add rule inet fw4 forward ether saddr $CURFEW_MACS \
    counter drop comment "${PREFIX}-Curfew-Block"
fi
```

### 4. Disable Script — `/usr/bin/curfew-disable.sh`

Looks up each rule by its comment name and deletes it by handle number. No hardcoded handles — survives reboots and rule reordering.

```sh
#!/bin/sh
GROUP="${1:-kids}"
case "$GROUP" in
  kids) COMMENTS="Kids-Every-Morning Kids-SchoolNight-Late Kids-Friday-08to15" ;;
  roku) COMMENTS="Roku-Every-Morning Roku-SchoolNight-Late Roku-Friday-08to15" ;;
  teen) COMMENTS="Teen-Curfew-Block" ;;
  tv)   COMMENTS="TV-Curfew-Block" ;;
  *) exit 1 ;;
esac

for comment in $COMMENTS; do
  handle=$(nft -a list chain inet fw4 forward | grep "$comment" | grep -o 'handle [0-9]*' | awk '{print $2}')
  [ -n "$handle" ] && nft delete rule inet fw4 forward handle $handle
done
```

### 5. Status Script — `/usr/bin/curfew-status.sh`

Returns JSON — checks for the presence of the primary rule comment to determine state:

```sh
#!/bin/sh
GROUP="${1:-kids}"
case "$GROUP" in
  kids) CHECK="Kids-Every-Morning" ;;
  roku) CHECK="Roku-Every-Morning" ;;
  teen) CHECK="Teen-Curfew-Block" ;;
  tv)   CHECK="TV-Curfew-Block" ;;
  *) echo '{"curfew":"error"}'; exit 1 ;;
esac
count=$(nft list chain inet fw4 forward | grep -c "$CHECK")
[ "$count" -gt "0" ] && echo '{"curfew":"on"}' || echo '{"curfew":"off"}'
```

### 6. HTTP API — `/www/cgi-bin/curfew`

A shell CGI served by `uhttpd`. Accepts POST with `action`, `group`, and `key`. A single parameterized endpoint handles all groups.

Actions: `enable` | `disable` | `status` | `status_all`

```sh
#!/bin/sh
API_KEY="YOUR_API_KEY"
read POST_DATA
ACTION=$(echo "$POST_DATA" | grep -o 'action=[^&]*' | cut -d= -f2)
KEY=$(echo "$POST_DATA" | grep -o 'key=[^&]*' | cut -d= -f2)
GROUP=$(echo "$POST_DATA" | grep -o 'group=[^&]*' | cut -d= -f2)
GROUP="${GROUP:-kids}"

echo "Content-Type: application/json"
echo ""

[ "$KEY" != "$API_KEY" ] && echo '{"status":"error","message":"unauthorized"}' && exit 0

case "$ACTION" in
  enable)     /usr/bin/curfew-enable.sh "$GROUP";  echo '{"status":"ok","action":"enabled","group":"'"$GROUP"'"}' ;;
  disable)    /usr/bin/curfew-disable.sh "$GROUP"; echo '{"status":"ok","action":"disabled","group":"'"$GROUP"'"}' ;;
  status)     /usr/bin/curfew-status.sh "$GROUP" ;;
  status_all) echo "{\"kids\":\"$(get_status kids)\",\"roku\":\"$(get_status roku)\",\"teen\":\"$(get_status teen)\",\"tv\":\"$(get_status tv)\"}" ;;
  *)          echo '{"status":"error","message":"unknown action"}' ;;
esac
```

### 7. Boot Persistence — `/etc/init.d/curfew-rules`

Restores scheduled groups at boot. Manual-only groups are left off intentionally.

```sh
#!/bin/sh /etc/rc.common
START=99
start() {
  /usr/bin/curfew-enable.sh kids
  /usr/bin/curfew-enable.sh roku
}
```

```sh
chmod +x /etc/init.d/curfew-rules
/etc/init.d/curfew-rules enable
```

### 8. Make Executable & Preserve Through Upgrades

```sh
chmod +x /usr/bin/curfew-*.sh /www/cgi-bin/curfew
```

Add all files to `/etc/sysupgrade.conf` so they survive firmware upgrades.

### 9. Verify

```sh
# Test from the router
curl -s -X POST http://127.0.0.1/cgi-bin/curfew \
  -d 'action=status_all&key=YOUR_API_KEY'

# Check active rules
nft list chain inet fw4 forward | grep Curfew

# Watch live activity
logread -f | grep curfew
```

## Home Assistant Setup

### `configuration.yaml`

Replace `192.168.1.1` with your router's IP and `YOUR_API_KEY` with the key you generated.

```yaml
rest_command:
  curfew:
    url: "http://192.168.1.1/cgi-bin/curfew"
    method: POST
    content_type: "application/x-www-form-urlencoded"
    payload: "action={{ action }}&group={{ group }}&key=YOUR_API_KEY"

command_line:
  - sensor:
      name: "Curfew Status All"
      unique_id: curfew_status_all
      command: >
        curl -s -X POST http://192.168.1.1/cgi-bin/curfew
        -d 'action=status_all&key=YOUR_API_KEY'
      value_template: "{{ value_json.kids }}"
      json_attributes: [kids, roku, teen, tv]
      scan_interval: 60
      icon: mdi:shield-lock
```

> **`!secret` won't work here.** `!secret` is a YAML tag resolved at parse time; Jinja2 variables (`{{ action }}`, `{{ group }}`) are resolved at runtime. They can't be mixed — HA will literally send `key=!secret curfew_api_key` as a string. The key must be written in plain text in a parameterized `rest_command`.

### `templates.yaml`

One template switch per group — each reads from the `curfew_status_all` sensor attributes:

```yaml
- switch:
    - name: "Kids Curfew"
      unique_id: kids_curfew_switch
      state: "{{ state_attr('sensor.curfew_status_all', 'kids') == 'on' }}"
      availability: "{{ states('sensor.curfew_status_all') not in ['unknown', 'unavailable'] }}"
      icon: "{{ 'mdi:shield-lock' if state_attr('sensor.curfew_status_all', 'kids') == 'on' else 'mdi:shield-off-outline' }}"
      turn_on:
        - action: rest_command.curfew
          data: {action: enable, group: kids}
        - delay: {seconds: 1}
        - action: homeassistant.update_entity
          target: {entity_id: sensor.curfew_status_all}
      turn_off:
        - action: rest_command.curfew
          data: {action: disable, group: kids}
        - delay: {seconds: 1}
        - action: homeassistant.update_entity
          target: {entity_id: sensor.curfew_status_all}
    # Repeat pattern for roku, teen, tv groups
```

### Automations

Manual-only groups auto-disable at 7 am in case they were left on overnight:

```yaml
- alias: "Curfew Auto-Disable Teen PC at 7am"
  trigger:
    - platform: time
      at: "07:00:00"
  condition:
    - condition: state
      entity_id: switch.teen_curfew
      state: "on"
  action:
    - action: switch.turn_off
      target: {entity_id: switch.teen_curfew}
  mode: single
```

### Dashboard

Tile cards on the parents' dashboard, restricted to authorized accounts via a `conditional` card with a user ID check:

```yaml
type: conditional
conditions:
  - condition: user
    users:
      - YOUR_USER_ID_HERE
card:
  type: tile
  entity: switch.kids_curfew
  name: "Kids Curfew"
  icon: mdi:shield-account
  color: red
```

After editing, reload via **Developer Tools → YAML → Reload All YAML**. A full restart is not required.

## Adding a New Group

1. Create `/usr/bin/curfew-macs-GROUPNAME.sh` with MAC addresses
2. Add a `case` entry to all three scripts (enable, disable, status)
3. Add the group to `status_all` in the CGI
4. Add to `/etc/sysupgrade.conf`
5. Add a template switch in `templates.yaml`
6. Add a dashboard tile card
7. If manual-only, add a 7 am auto-disable automation

## Troubleshooting

| Symptom | Check |
|---------|-------|
| Rules not applying | Verify MAC addresses are quoted: `CURFEW_MACS="{ aa:bb:... }"` |
| Status always "off" | Confirm the comment name in `curfew-status.sh` matches what `curfew-enable.sh` writes |
| HA switch unavailable | Sensor hasn't polled yet — wait 60 s or call `homeassistant.update_entity` on `sensor.curfew_status_all` |
