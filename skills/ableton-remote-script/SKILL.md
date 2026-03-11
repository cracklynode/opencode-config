---
name: ableton-remote-script
description: Create User Remote Scripts for Ableton Live to map MIDI controllers
version: 1.0.0
author: Nick Foard
type: skill
category: development
tags:
  - ableton
  - midi
  - controller
  - remote-script
  - instant-mappings
---

# Ableton Remote Script

> Create UserConfiguration.txt files for Ableton Live's InstantMappings feature

## Purpose

Generate a `UserConfiguration.txt` file that maps a MIDI controller's CC numbers to Ableton Live's transport, mixer, and device controls. This enables you to use almost any MIDI controller with Ableton Live without writing Python code.

## How It Works

1. You provide the CC numbers from your controller's documentation
2. The skill generates a properly formatted `UserConfiguration.txt`
3. Create a folder in Ableton's User Remote Scripts directory
4. Select your script in Ableton's MIDI preferences

## Inputs Required

| Input | Description | Required |
|-------|-------------|----------|
| `CONTROLLER_NAME` | Name of your MIDI controller (folder name) | Yes |
| `INPUT_PORT` | Input port name in Ableton MIDI prefs | Yes |
| `OUTPUT_PORT` | Output port name in Ableton MIDI prefs | Yes |
| `MIDI_CHANNEL` | Global MIDI channel (0-15) | Yes |
| `TRANSPORT_PLAY_CC` | CC# for Play button | Yes |
| `TRANSPORT_STOP_CC` | CC# for Stop button | Yes |
| `TRANSPORT_REWIND_CC` | CC# for Rewind button | Yes |
| `TRANSPORT_FFWD_CC` | CC# for Fast Forward button | Yes |
| `TRANSPORT_REC_CC` | CC# for Record button | Yes |
| `TRANSPORT_LOOP_CC` | CC# for Loop button | No |
| `FADER_START_CC` | Starting CC# for 8 faders | Yes |
| `KNOB_START_CC` | Starting CC# for 8 knobs | Yes |
| `MUTE_START_CC` | Starting CC# for 8 Mute buttons | Yes |
| `SOLO_START_CC` | Starting CC# for 8 Solo buttons | Yes |
| `RECORD_ARM_START_CC` | Starting CC# for 8 Record Arm buttons | Yes |
| `BANK_PREV_CC` | CC# for Previous Bank button | No |
| `BANK_NEXT_CC` | CC# for Next Bank button | No |
| `OUTPUT_FOLDER` | Folder path for the script | Yes |

## Workflow

### Step 1: Controller Information

Collect basic controller details:
- **CONTROLLER_NAME**: Will be the folder name in User Remote Scripts
- **INPUT_PORT / OUTPUT_PORT**: Find in Ableton → Preferences → MIDI/Sync
- **MIDI_CHANNEL**: Usually 0 (first channel)

### Step 2: Transport Controls

Map the transport buttons. Find these CCs in your controller's documentation:
- Play, Stop, Rewind, Fast Forward, Record
- Loop (optional)

### Step 3: Channel Strip Controls

Map the 8 channel strips. Enter the **starting CC#** for each group:

| Control | Example | Notes |
|---------|---------|-------|
| Faders | CC 0-7 → enter `0` | Volumes for tracks 1-8 |
| Knobs | CC 16-23 → enter `16` | Device parameters |
| Mute | CC 48-55 → enter `48` | Track mute buttons |
| Solo | CC 32-39 → enter `32` | Track solo buttons |
| Record Arm | CC 64-71 → enter `64` | Track record arm |

### Step 4: Bank Switching

Map bank navigation (optional):
- Previous Bank / Next Bank buttons
- Or Track Prev / Track Next if no dedicated bank buttons

### Step 5: Generate Script

Create the `UserConfiguration.txt` file in your specified folder.

## Output

Creates: `{OUTPUT_FOLDER}/{CONTROLLER_NAME}/UserConfiguration.txt`

Example structure:
```
My_Custom_UserRemote_Scripts/
└── nanoKONTROL2_NF/
    └── UserConfiguration.txt
```

## Using the Script in Ableton

1. Copy the folder to Ableton's User Remote Scripts directory:
   - **Mac**: `~/Library/Application Support/Ableton/Live 12 Suite/User Remote Scripts/`
   - **Windows**: `C:\Users\[username]\AppData\Roaming\Ableton\Live 12 Suite\User Remote Scripts\`

2. Open Ableton Live → Preferences → MIDI/Sync

3. Under "Control Surface", select your controller name

4. Set Input/Output to your controller's ports

5. Close preferences - your controller is now mapped!

## Reference Templates

- `My_Custom_UserRemote_Scripts/nanoKEY Studio_NF/UserConfiguration.txt`
- `My_Custom_UserRemote_Scripts/nanoKONTROL2_NF/UserConfiguration.txt`
- `Ableton_Template_and_instructions/UserConfiguration.txt`

## Example: nanoKONTROL2

**Input:**
- CONTROLLER_NAME: `nanoKONTROL2_NF`
- INPUT_PORT: `nanoKONTROL2 (SLIDER/KNOB)`
- OUTPUT_PORT: `nanoKONTROL2 (CTRL)`
- MIDI_CHANNEL: 0
- TRANSPORT_PLAY_CC: 41
- TRANSPORT_STOP_CC: 42
- TRANSPORT_REWIND_CC: 43
- TRANSPORT_FFWD_CC: 44
- TRANSPORT_REC_CC: 45
- TRANSPORT_LOOP_CC: 46
- FADER_START_CC: 0
- KNOB_START_CC: 16
- MUTE_START_CC: 48
- SOLO_START_CC: 32
- RECORD_ARM_START_CC: 64
- BANK_PREV_CC: 58
- BANK_NEXT_CC: 59
- OUTPUT_FOLDER: `My_Custom_UserRemote_Scripts`

**Result:** Creates `My_Custom_UserRemote_Scripts/nanoKONTROL2_NF/UserConfiguration.txt`

## Tips

- Use `-1` for any optional control to disable it
- Controller name must start with a letter (not number or underscore)
- CC numbers range from 0-127
- MIDI channels range from 0-15 (0 = first channel)
- Some controllers use different CCs per MIDI channel - use GlobalChannel for main channel
