import { useCallback, useEffect, useRef } from "react";
import { getNoteWithOctave } from "./helpers/octave";
import { useNotes } from "./state/notes";
import { NoteType, Octave } from "./types/music";
import { useOctaveForComputerKeyboard } from "./useOctave";

const getNoteFromKeyboard = (
  keyboardKey: string,
  octave: Octave
): string | undefined => {
  const getActiveMIDIKey = () => {
    const keyMap: Record<
      string,
      { activeMIDIKey: number; upOctave?: boolean }
    > = {
      a: { activeMIDIKey: 0 },
      w: { activeMIDIKey: 1 },
      s: { activeMIDIKey: 2 },
      e: { activeMIDIKey: 3 },
      d: { activeMIDIKey: 4 },
      f: { activeMIDIKey: 5 },
      t: { activeMIDIKey: 6 },
      g: { activeMIDIKey: 7 },
      y: { activeMIDIKey: 8 },
      h: { activeMIDIKey: 9 },
      u: { activeMIDIKey: 10 },
      j: { activeMIDIKey: 11 },
      k: { activeMIDIKey: 12, upOctave: true },
    };
    return keyMap[keyboardKey];
  };

  const { activeMIDIKey, upOctave } = getActiveMIDIKey() || {};

  let note;
  // last C up octave
  const NOTES = [
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
    "C",
  ];

  if (activeMIDIKey !== undefined) {
    note = getNoteWithOctave(NOTES[activeMIDIKey], octave, upOctave);
  }
  return note;
};

const useComputerKeyboardMidiController = (): {
  octave: Octave;
  activeNotes: NoteType[];
} => {
  const { octave } = useOctaveForComputerKeyboard();
  const { activateNote, deactivateNote } = useNotes();
  const activeNotes = useRef<Map<NoteType["name"], NoteType>>(new Map());

  // const handlePause = useCallback((e: KeyboardEvent) => {
  //   if (e.key === " ") {
  //   }
  // }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // handlePause(e);
      const keyboardKey = e.key.toLowerCase();

      // keyboard keys mapping
      const MINOR_KEYS = ["w", "e", "t", "y", "u"];
      const MAJOR_KEYS = ["a", "s", "d", "f", "g", "h", "j", "k"];

      if ([...MINOR_KEYS, ...MAJOR_KEYS].includes(keyboardKey)) {
        const note = getNoteFromKeyboard(keyboardKey, octave);
        if (note) {
          activateNote(note);
        }
      }
    },
    [activateNote, octave]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      const keyboardKey = e.key.toLowerCase();
      const note = getNoteFromKeyboard(keyboardKey, octave);
      if (note) {
        deactivateNote(note);
      }
    },
    [deactivateNote, octave]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { octave, activeNotes: [...activeNotes.current.values()] };
};

export default useComputerKeyboardMidiController;
