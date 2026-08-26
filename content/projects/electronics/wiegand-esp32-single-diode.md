---
title: "One Diode to Read a 5V Wiegand Keypad on a 3.3V ESP32"
date: 2026-08-25
categories: [electronics, home-assistant]
tags: [esp32, esphome, wiegand, level-shifting, ratgdo]
status: complete
summary: "Wiegand data lines idle at 5V, and the ESP32 is not 5V-tolerant. You don't need a level-shifter IC or a resistor divider — a single signal diode does the job, and it does it better."
---

## The problem

I was adding a Wiegand keypad to a [ratgdo32](https://ratcloud.llc/products/ratgdo32)
(ESP32-WROOM-32E) so the garage door could take a PIN. Wiegand is a dead-simple
two-wire protocol — `D0` and `D1`, both open-collector, both idling high and
pulsed low to send bits. The catch: my keypad idles those lines at **5V**, and
the ESP32's GPIOs are **not 5V-tolerant**.

You can measure the problem directly. With the ESP32 disconnected, `D0`/`D1`
float at 5V. Connect the ESP32 and they sag to ~4.3V — that 0.7V drop is the
GPIO's internal ESD clamp diode already conducting, quietly dumping current
into the chip's supply rail. It "works," but you're abusing the clamp on every
idle-high, which is exactly the thing you don't want to design around.

This is the same [RATGDO-based garage door build](/projects/electronics/wiegand-keypad-garage/)
that ended up shipping with resistor dividers instead — see that project's
write-up for why, and how it went. This page documents the diode approach I'd
use if I were doing it again.

It's also the reason I was looking at this in the first place: the original
standalone reader had `D0`/`D1` wired straight to its ESP32's GPIOs with no
level shifting at all, exactly the "it works but you're abusing the clamp"
situation above, held continuously for as long as the keypad idled high. That
ESP32 eventually failed. I can't prove that's what killed it, but it's the
more concrete suspect over the weather-extremes theory, and it's exactly the
stress this diode avoids.

## The usual answers (and why I skipped them)

- **Resistor divider** — works, but it's two resistors per line, it loads the
  open-collector output, and it slows the edges with the line capacitance on a
  long cable run.
- **Series resistor into the clamp diode** — the "limit the current and let the
  clamp cope" approach. Functional, but you're still deliberately forward-biasing
  the ESP32's protection diode as your normal operating mode. It also does nothing
  to stop back-feed if the keypad powers up before the ESP32 (mine runs off a
  separate 12V supply, so it does).
- **Dedicated level-shifter IC** (BSS138 board, TXB0108, etc.) — correct, but it's
  a part to source, place, and wire for a signal that only ever moves in one
  direction and only ever needs to be pulled *low*.

## The one-diode trick

Here's the whole circuit, per data line:

```text
   Keypad D0 (5V idle)          ESP32 GPIO (internal pull-up to 3.3V)
        │                                   │
        ├──────────►│───────────────────────┤
              cathode   anode
                  1N4148
```

**Cathode to the keypad side, anode to the GPIO.** That polarity looks backwards
the first time you see it. It isn't.

**Idle (D0 high at 5V):** the cathode sits at 5V, the anode sits at 3.3V from the
GPIO's internal pull-up. Cathode higher than anode means the diode is **reverse
biased** — it blocks. The GPIO just floats up to its own 3.3V pull-up and reads a
clean logic HIGH. The 5V never reaches the pin.

**Active (keypad pulls D0 low):** now the cathode is dragged toward 0V, the anode
is still at 3.3V, so the diode is **forward biased** and conducts. It pulls the
GPIO down to about a diode drop above the keypad's low level, which the ESP32
reads as LOW.

That's the entire insight: **Wiegand carries its data in the pull-*low*.** The
high level is just idle. So you only need the level shifter to pass the low — and
a diode passes exactly one direction. The high level, which is the part that would
hurt the ESP32, is the part the diode blocks.

One 1N4148 per line. Two diodes total. No divider, no IC, no board.

## The bonus you get for free

Because the diode blocks conduction toward the GPIO whenever the keypad side is
higher, it also **blocks back-feed into an unpowered ESP32**. If the keypad's 12V
supply comes up first and parks `D0`/`D1` at 5V while the ESP32 is still dark, the
cathode is at 5V, the anode is at ~0V, the diode is reverse biased, and no current
sneaks into the unpowered chip. The series-resistor approach can't claim that —
it just limits the back-feed, it doesn't stop it. This alone sold me on the diode.

## The honest caveat

The forward-biased diode pulls the GPIO down to roughly `V_low + V_f`. With a
1N4148 at these tiny currents, `V_f` is around 0.6–0.7V, so the pin bottoms out
near 0.7V. The ESP32's input-low threshold (`V_IL`) is about 0.25·Vdd ≈ 0.8V, so
you're reading LOW — but the noise margin is modest, not generous.

It worked reliably for me with a plain 1N4148 over a 40ft cable run. But if you
want more margin, swap in a **Schottky** (BAT54, 1N5817) — its ~0.3V forward drop
puts the low around 0.3–0.4V and buys back a comfortable chunk of headroom.
Same polarity, same idea.

## What I actually built

- **Board:** ratgdo32, ESP32-WROOM-32E
- **Pins:** `D0 → GPIO33`, `D1 → GPIO35`. Every pin on the ratgdo32's 6-pin JST was
  already claimed by the garage firmware, so these were soldered to the module's
  exposed castellations. GPIO35 is input-only with no internal pull-up, which is
  fine — Wiegand keypads supply their own pull-up, so the pin only needs to *read*.
- **Protection:** one 1N4148 per line, cathode to keypad, anode to GPIO.
- **Cable:** ~40ft of Cat3, one pair for `D0`/`D1`, the other pair for the keypad's
  +12V. Keypad powered locally at the keypad end from its own supply; **all grounds
  common**. The RC and voltage-drop math on that run were both non-issues.
- **Firmware:** ESPHome `wiegand:` + `key_collector:`. The device does nothing clever
  — it collects the PIN and publishes it. Secrets and logic live upstream in Home
  Assistant, not on the edge node. (That's a deliberate design stance: edge devices
  collect and forward, they don't hoard secrets.)

## Postscript: some RATGDO pins may not have needed the diode at all

After soldering the diodes onto the castellations as this "bug" fix, it occurred to
me that the ratgdo32's own connector already breaks out GPIOs that carry clamping
diode protection of their own — the pins wired with black leads on its harness. Had
I routed `D0`/`D1` into one of those instead of a bare castellation, the external
diode might have been redundant from the start. I didn't realize this until after
the bodge was already in and working, so I can't say for certain it would have been
sufficient on its own — but it's worth checking your board's own protected pins
before adding external protection. Worst case, the diode does no harm stacked on
top of an already-protected input; best case, you skip two parts entirely.

## Recommendation

If you're bringing a 5V open-collector, active-low signal into a 3.3V MCU —
Wiegand being the classic case — reach for a single series diode before you reach
for a level-shifter IC or a divider:

- Use it when the signal is **active-low** and you only care about the pull-down.
  (This trick does **not** work for active-high signaling — the diode won't pass the
  high level you'd need.)
- Cathode to the higher-voltage side, anode to the MCU pin, MCU pull-up enabled.
- Reach for a **Schottky** if you want more low-side noise margin, or if your MCU's
  `V_IL` is tight.
- Enjoy the free back-feed protection for mixed power-up ordering.
- Check whether your board already exposes a clamp-diode-protected pin before
  adding an external one — see the postscript above.

It's the kind of solution that feels too simple until you trace the biasing in both
states and realize the diode is doing precisely — and only — the one job the signal
actually needs.
