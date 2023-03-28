import { useCallback, useState } from "react";
import { Song, Track, Instrument } from "reactronica";
import { withNotes, useNotes } from "../src/state/notes";
import { NoteType, Octave } from "../src/types/music";
import useComputerKeyboardMidiController from "../src/useComputerKeyboardMidiController";
import useMidiKeyboard from "../src/useMidiKeyboard";
import { useOctave, withOctave } from "../src/useOctave";
import { getNoteWithOctave } from "../src/helpers/octave";

const Key = ({
  note,
  octave,
  octaveUp = false,
  isActive = false,
  isMinorKey = false,
}: {
  isActive?: boolean;
  isMinorKey?: boolean;
  note: NoteType;
  octave: Octave;
  octaveUp?: boolean;
}) => {
  const { activateNote, deactivateNote } = useNotes();
  const handleKeyDown = (e: any) => {
    console.log({ note: e.target.name });
    activateNote(e.target.name);
  };

  const handleKeyUp = (e: any) => {
    deactivateNote(e.target.name);
  };

  return (
    <button
      style={{
        marginBottom: isMinorKey ? "20px" : "",
        ...(isActive ? { backgroundColor: "red" } : {}),
      }}
      onMouseDown={handleKeyDown}
      onMouseUp={handleKeyUp}
      name={getNoteWithOctave(note.name, octave, octaveUp)}
    >
      {getNoteWithOctave(note.name, octave, octaveUp)}
    </button>
  );
};

const Keyboard = ({
  activeNotes,
  octave,
}: {
  activeNotes: NoteType[];
  octave: Octave;
}) => {
  return (
    <div style={{ display: "flex" }}>
      <Key
        isActive={
          !!activeNotes?.find(
            (note) => note.name === getNoteWithOctave("C", octave)
          )
        }
        note={{ name: "C" }}
        octave={octave}
      />
      <Key
        isMinorKey
        isActive={
          !!activeNotes?.find(
            (note) => note.name === getNoteWithOctave("C#", octave)
          )
        }
        note={{ name: "C#" }}
        octave={octave}
      />
      <Key
        isActive={
          !!activeNotes?.find(
            (note) => note.name === getNoteWithOctave("D", octave)
          )
        }
        note={{ name: "D" }}
        octave={octave}
      />
      <Key
        isMinorKey
        isActive={
          !!activeNotes?.find(
            (note) => note.name === getNoteWithOctave("D#", octave)
          )
        }
        note={{ name: "D#" }}
        octave={octave}
      />
      <Key
        isActive={
          !!activeNotes?.find(
            (note) => note.name === getNoteWithOctave("E", octave)
          )
        }
        note={{ name: "E" }}
        octave={octave}
      />
      <Key
        isActive={
          !!activeNotes?.find(
            (note) => note.name === getNoteWithOctave("F", octave)
          )
        }
        note={{ name: "F" }}
        octave={octave}
      />
      <Key
        isMinorKey
        isActive={
          !!activeNotes?.find(
            (note) => note.name === getNoteWithOctave("F#", octave)
          )
        }
        note={{ name: "F#" }}
        octave={octave}
      />
      <Key
        isActive={
          !!activeNotes?.find(
            (note) => note.name === getNoteWithOctave("G", octave)
          )
        }
        note={{ name: "G" }}
        octave={octave}
      />
      <Key
        isMinorKey
        isActive={
          !!activeNotes?.find(
            (note) => note.name === getNoteWithOctave("G#", octave)
          )
        }
        note={{ name: "G#" }}
        octave={octave}
      />
      <Key
        isActive={
          !!activeNotes?.find(
            (note) => note.name === getNoteWithOctave("A", octave)
          )
        }
        note={{ name: "A" }}
        octave={octave}
      />
      <Key
        isMinorKey
        isActive={
          !!activeNotes?.find(
            (note) => note.name === getNoteWithOctave("A#", octave)
          )
        }
        note={{ name: "A#" }}
        octave={octave}
      />
      <Key
        isActive={
          !!activeNotes?.find(
            (note) => note.name === getNoteWithOctave("B", octave)
          )
        }
        note={{ name: "B" }}
        octave={octave}
      />
      <Key
        octaveUp
        isActive={
          !!activeNotes?.find(
            (note) =>
              note.name ===
              getNoteWithOctave("C", String(Number(octave) + 1) as Octave)
          )
        }
        note={{ name: "C" }}
        octave={octave}
      />
    </div>
  );
};

const KeyboardAudio = withOctave(
  withNotes(() => {
    const { notes: activeNotes } = useNotes();
    const { octave: activeOctave } = useOctave();

    useMidiKeyboard();
    useComputerKeyboardMidiController();

    console.log({ activeNotes });
    return (
      <>
        <span>octave: {activeOctave}</span>
        <div style={{ display: "flex", overflowX: "auto" }}>
          <Keyboard key="0" activeNotes={activeNotes} octave="0" />
          <Keyboard key="1" activeNotes={activeNotes} octave="1" />
          <Keyboard key="2" activeNotes={activeNotes} octave="2" />
          <Keyboard key="3" activeNotes={activeNotes} octave="3" />
          <Keyboard key="4" activeNotes={activeNotes} octave="4" />
          <Keyboard key="5" activeNotes={activeNotes} octave="5" />
          <Keyboard key="6" activeNotes={activeNotes} octave="6" />
          <Keyboard key="7" activeNotes={activeNotes} octave="7" />
          <Keyboard key="8" activeNotes={activeNotes} octave="8" />
        </div>

        {JSON.stringify(activeNotes)}

        <Song>
          <Track>
            <Instrument type="synth" notes={activeNotes} />
          </Track>
        </Song>
      </>
    );
  })
);

const App = () => {
  return (
    <>
      <KeyboardAudio />
    </>
  );
};

export default App;
