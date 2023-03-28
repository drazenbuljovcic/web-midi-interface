import { useCallback, useEffect } from "react";
import { getNoteWithOctave } from "./helpers/octave";
import { useNotes } from "./state/notes";
import { Octave } from "./types/music";
import { useOctave } from "./useOctave";

type NoteType = {
  name: string;
  velocity?: number;
  duration?: number | string;
  /** Use unique key to differentiate from same notes, otherwise it won't play */
  key?: string | number;
};

const useMidiKeyboard = (): {
  activeOctave: Octave;
} => {
  const { activateNote, deactivateNote } = useNotes();
  const { octave, setOctave } = useOctave();

  const onMIDISuccess = useCallback(
    (midiAccess: any) => {
      console.log(midiAccess);

      var inputs = midiAccess.inputs;
      var outputs = midiAccess.outputs;

      const noteOn = (
        note: NoteType["name"],
        octave: Octave,
        velocity: any
      ) => {
        console.log({ note, octave });

        const fullNote = getNoteWithOctave(note, octave);
        activateNote(fullNote);
        setOctave(octave);
      };

      const noteOff = (note: NoteType["name"], octave: Octave) => {
        console.log({ note, octave });
        const fullNote = getNoteWithOctave(note, octave);
        deactivateNote(fullNote);
      };

      let noteNames: string[] = [
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
      ];

      // https://dzone.com/articles/the-possibilities-of-web-midi-with-typescript
      // https://www.smashingmagazine.com/2018/03/web-midi-api/
      function getMIDIMessage(message: WebMidi.MIDIMessageEvent) {
        var command = message.data[0];
        var note = message.data[1];
        var velocity = message.data.length > 2 ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

        let octave = Math.trunc(note / 12);
        let noteName = noteNames[note % 12];

        switch (command) {
          case 144: // noteOn
            if (velocity > 0) {
              noteOn(noteName, String(octave) as Octave, velocity);
            } else {
              noteOff(noteName, String(octave) as Octave);
            }
            break;
          case 128: // noteOff
            noteOff(noteName, String(octave) as Octave);
            break;
          // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
        }
      }

      for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = getMIDIMessage;
      }

      console.log({ inputs, outputs });
    },
    [activateNote, deactivateNote, setOctave]
  );

  const onMIDIFailure = useCallback(() => {
    console.log("Could not access your MIDI devices.");
  }, []);

  useEffect(() => {
    if (
      typeof navigator !== "undefined" &&
      (navigator as unknown as { requestMIDIAccess: () => {} })
        .requestMIDIAccess
    ) {
      console.log("This browser supports WebMIDI!");
    } else {
      console.log("WebMIDI is not supported in this browser.");
    }

    if (typeof navigator !== "undefined") {
      (navigator as unknown as { requestMIDIAccess: () => Promise<any> })
        .requestMIDIAccess()
        .then(onMIDISuccess, onMIDIFailure);
    }
  }, [onMIDISuccess, onMIDIFailure]);

  return { activeOctave: octave };
};

export default useMidiKeyboard;
