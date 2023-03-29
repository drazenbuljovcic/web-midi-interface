// @ts-disable

import { useCallback, useEffect, useRef, useState } from "react";
import { Song, Track, Instrument } from "reactronica";
import useMidi from "../src/useMidi";

type NoteType = {
  name: string;
  velocity?: number;
  duration?: number | string;
  /** Use unique key to differentiate from same notes, otherwise it won't play */
  key?: string | number;
};
type Octave = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";


// note octave
// C<#> 3
const withOctave = (note: string, octave: Octave, upOctave = false) => {
  const output = note.includes("#")
    ? `${note}${octave}`
    : `${note}${Number(octave) + Number(upOctave)}`;
  return output;
};


const Key = ({ note, octave, isActive = false, isMinorKey = false, onKeyDown, onKeyUp }: {
  isActive?: boolean;
  isMinorKey?: boolean;
  note: NoteType;
  octave: Octave;
  onKeyDown: (note: NoteType[]) => void;
  onKeyUp: () => void;
}) => {
  const handleKeyDown = (e: any) => {
    console.log({ note: e.target.name });
    onKeyDown([{ name: e.target.name }]);
  };

  return (
    <button
      style={{marginBottom: isMinorKey ? '20px' : '', ...(isActive ? {backgroundColor:  'red' } : {})}}
      onMouseDown={handleKeyDown}
      onMouseUp={onKeyUp}
      onTouchStart={handleKeyDown}
      onTouchEnd={onKeyUp}
      name={withOctave(note.name, octave)}
    >
      {withOctave(note.name, octave)}
    </button>
  )
};

const Keyboard = ({
  activeNotes,
  octave,
  onKeyDown,
  onKeyUp,
}: {
  activeNotes: NoteType[];
  octave: Octave;
  onKeyDown: (e: any) => void;
  onKeyUp: () => void;
}) => {
  console.log({activeNotes, active: !!activeNotes?.find(note => note.name === withOctave("C", octave))})
  return (
    <div style={{ display: "flex" }}>
      <Key isActive={!!activeNotes?.find(note => note.name === withOctave("C", octave))} note={{ name: "C" }} octave={octave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
      <Key isMinorKey isActive={!!activeNotes?.find(note => note.name === withOctave("C#", octave))} note={{ name: "C#" }} octave={octave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
      <Key isActive={!!activeNotes?.find(note => note.name === withOctave("D", octave))} note={{ name: "D" }} octave={octave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
      <Key isMinorKey isActive={!!activeNotes?.find(note => note.name === withOctave("D#", octave))} note={{ name: "D#" }} octave={octave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
      <Key isActive={!!activeNotes?.find(note => note.name === withOctave("E", octave))} note={{ name: "E" }} octave={octave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
      <Key isActive={!!activeNotes?.find(note => note.name === withOctave("F", octave))} note={{ name: "F" }} octave={octave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
      <Key isMinorKey isActive={!!activeNotes?.find(note => note.name === withOctave("F#", octave))} note={{ name: "F#" }} octave={octave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
      <Key isActive={!!activeNotes?.find(note => note.name === withOctave("G", octave))} note={{ name: "G" }} octave={octave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
      <Key isMinorKey isActive={!!activeNotes?.find(note => note.name === withOctave("G#", octave))} note={{ name: "G#" }} octave={octave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
      <Key isActive={!!activeNotes?.find(note => note.name === withOctave("A", octave))} note={{ name: "A" }} octave={octave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
      <Key isMinorKey isActive={!!activeNotes?.find(note => note.name === withOctave("A#", octave))} note={{ name: "A#" }} octave={octave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
      <Key isActive={!!activeNotes?.find(note => note.name === withOctave("B", octave))} note={{ name: "B" }} octave={octave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
      <Key isActive={!!activeNotes?.find(note => note.name === withOctave("C", String(Number(octave) + 1) as Octave))} note={{ name: "C" }} octave={octave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
    </div>
  );
};

const useOctave = (): {
  octave: Octave;
  setOctave: (octave: Octave) => void;
} => {
  const [octave, setOctave] = useState<Octave>("0");

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "x") {
      setOctave((prev) => {
        const next = Number(prev) + 1;
        return next > 7 ? "7" : next.toString() as Octave;
      }); 
    }
    if (e.key.toLowerCase() === "z") {
      setOctave((prev) => {
        const next = Number(prev) - 1;
        return next < 0 ? "0" : next.toString() as Octave;
      });
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {}, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }
  }, [handleKeyDown, handleKeyUp]);

  return { octave, setOctave };
};

const useKeyboardMidiController = ({ onKeyDown, onKeyUp }: {
  onKeyDown: any;
  onKeyUp: any;
}): { octave: Octave } => {
  const { octave } = useOctave();

  const handlePause = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ') {
      onKeyUp();
    }
  }, [onKeyUp]);


  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    handlePause(e);
    const keyboardKey = e.key.toLowerCase();
    // keyboard keys mapping
    const MINOR_KEYS = ['w', 'e', 't', 'y', 'u'];
    const MAJOR_KEYS = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];

    if ([...MINOR_KEYS, ...MAJOR_KEYS].includes(keyboardKey)) {

      const getNote = (): string | undefined => {
        const getActiveMIDIKey = () => {
          const keyMap: Record<string, {activeMIDIKey: number, upOctave?: boolean}> = {
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
          }
          return keyMap[keyboardKey];
        };

        const {activeMIDIKey, upOctave} = getActiveMIDIKey();

        let note;
        // last C up octave
        const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'];
        if (activeMIDIKey !== undefined) {
          note = withOctave(NOTES[activeMIDIKey], octave, upOctave)
          console.log({note})
        }
        return note;
      };

      const note = getNote();
      if (note) {
        onKeyDown([{ name: note }]);
      }
    }
  }, [onKeyDown, handlePause, octave]);

  const handleKeyUp = useCallback(() => {
    onKeyUp();
  }, [onKeyUp])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }
  }, [handleKeyDown, handleKeyUp]);

  return { octave };
};

const KeyboardAudio = () => {
  useMidi();
  const [notes, setNotes] = useState<NoteType[]>([]);

  const handleNoteDown = useCallback((notes: NoteType[]) => setNotes(notes), []);
  const handleNoteUp = useCallback(() => setNotes([]), []);

  const {octave: activeOctave} = useKeyboardMidiController({ onKeyDown: handleNoteDown, onKeyUp: handleNoteUp });
  console.log({notes})
  return (
    <div onMouseUp={handleNoteUp}>
      <span>octave: {activeOctave}</span>
      <Keyboard
        key="0"
        activeNotes={notes}
        octave="0"
        onKeyDown={handleNoteDown}
        onKeyUp={handleNoteUp}
      />
      <Keyboard
        key="1"
        activeNotes={notes}
        octave="1"
        onKeyDown={handleNoteDown}
        onKeyUp={handleNoteUp}
      />
      <Keyboard
        key="2"
        activeNotes={notes}
        octave="2"
        onKeyDown={handleNoteDown}
        onKeyUp={handleNoteUp}
      />
      <Keyboard
        key="3"
        activeNotes={notes}
        octave="3"
        onKeyDown={handleNoteDown}
        onKeyUp={handleNoteUp}
      />
      <Keyboard
        key="4"
        activeNotes={notes}
        octave="4"
        onKeyDown={handleNoteDown}
        onKeyUp={handleNoteUp}
      />
      <Keyboard
        key="5"
        activeNotes={notes}
        octave="5"
        onKeyDown={handleNoteDown}
        onKeyUp={handleNoteUp}
      />
      <Keyboard
        key="6"
        activeNotes={notes}
        octave="6"
        onKeyDown={handleNoteDown}
        onKeyUp={handleNoteUp}
      />
      <Keyboard
        key="7"
        activeNotes={notes}
        octave="7"
        onKeyDown={handleNoteDown}
        onKeyUp={handleNoteUp}
      />
      <Keyboard
        key="8"
        activeNotes={notes}
        octave="8"
        onKeyDown={handleNoteDown}
        onKeyUp={handleNoteUp}
      />

      {JSON.stringify(notes[0])}
      <Song>
        <Track>
          <Instrument type="synth" notes={notes} />
        </Track>
      </Song>
    </div>
  );
};

const App = () => {
  return (
    <>
      <KeyboardAudio />
    </>
  );
};

export default App;
