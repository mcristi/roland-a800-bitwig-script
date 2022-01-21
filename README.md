Roland A-800 PRO Bitwig controller script
==================

### Mappings 
The namings of the buttons/knobs/faders are the same as the ones from A-Pro Editor  

- L1 = select previous track
- L2 = select previous device page
- L3 = select next device page
- L4 = select next track
- L5 = stop
- L6 = play/continue play if paused
- L7 = pause
- L8 = record new clip in the next available slot (session view)
<br />

- P1 (hold pedal) = record new clip in the next available slot (session view)
<br />

- B1 = undo
- B2 = quantize selected clip
- B3 = toggle clip overdub & clip automation write 
- B4 = toggle metronome
<br />

- R1 - R8 = device macros
- R9 = cue volume
<br />

- S1 - S8 = track volume
- S9 = master volume

#### Different behavior depending on the selected CTRL Map
The mappings can be changed from A-PRO on the fly (see A-PRO manual)

- A1 - A8 = free to map via Bitwig mapping mechanism (`17 Bitwig FREE.mid`)
- A1 - A8 = send notes to drum rack (`18 Bitwig DRUMS.mid`)
- A1 - A8 = select and arm track (`19 Bitwig TRACKS.mid`)


### Workflow

- Select in Bitwig the desired Default launch quantization
- Select the desired track using L1, L4
- Enable the metronome using B4
- Start recording a new clip by pressing L8 or by pressing the hold pedal P1  
- Stop recording and play the recorded clip by pressing again L8 or P1
- Press B2 to overdub or to save automation of any device parameter (R1-R8) into the clip
- If not happy with the result, press undo (L1) and start again


### Installation

1. Copy `Roland A-800PRO.control.js` file to `~/Bitwig Studio/Controller Scripts/`
2. Load the three `.mid` files with the A-Pro Editor onto the midi controller
3. Select the desired mapping
4. Start Bitwig and select the script in preferences

