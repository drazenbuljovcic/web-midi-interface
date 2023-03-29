import clsx from 'clsx';
import { Song, Track, Instrument } from "reactronica";
import { withNotes, useNotes } from "../src/state/notes";
import { NoteType, Octave } from "../src/types/music";
import useComputerKeyboardMidiController from "../src/useComputerKeyboardMidiController";
import useMidiKeyboard from "../src/useMidiKeyboard";
import { getNoteWithOctave } from "../src/helpers/octave";
import { useOctave, withOctave } from "../src/state/octave";

const Key = ({
  note,
  octave,
  octaveUp = false,
  isActive = false,
  isMinorKey = false,
  doesNotHaveSharp = false,
}: {
  isActive?: boolean;
  isMinorKey?: boolean;
  note: NoteType;
  octave: Octave;
  octaveUp?: boolean;
  doesNotHaveSharp?: boolean;
}) => {
  const { activateNote, deactivateNote } = useNotes();
  const handleKeyDown = (e: any) => {
    activateNote(e.target.name);
  };

  const handleKeyUp = (e: any) => {
    deactivateNote(e.target.name);
  };

  return (
    <button
      className={clsx({
        "flex justify-center w-20 h-40 border-2 border-black": true,
        "w-14 h-28 z-10 ml-[-1.8rem] mr-[-1.8rem]": isMinorKey,
        'bg-red-500': isActive,
        'bg-black text-white': !isActive && isMinorKey,
        'bg-white text-black': !isActive && !isMinorKey,
        'border-r-0': doesNotHaveSharp,
      })}
      onMouseDown={handleKeyDown}
      onMouseUp={handleKeyUp}
      onTouchStart={handleKeyDown}
      onTouchEnd={handleKeyUp}
      onKeyDown={(e) => {
        if (e.key === " ") {
          handleKeyDown(e);
        }
      }}
      onKeyUp={(e) => {
        if (e.key === " ") {
          handleKeyUp(e);
        }
      }}
      name={getNoteWithOctave(note.name, octave, octaveUp)}
    >
      <span className="self-end">
        {note.name}
      </span>
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
    <div className='flex'>
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
        doesNotHaveSharp
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
        doesNotHaveSharp
      />
      {/* <Key
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
      /> */}
    </div>
  );
};

const KeyboardAudio = withOctave(
  withNotes(() => {
    const { notes: activeNotes } = useNotes();
    const { octave: activeOctave, setOctave } = useOctave();

    useMidiKeyboard();
    useComputerKeyboardMidiController();

    return (
      <>
        <span>
          octave:{" "}
          <input
            style={{ maxWidth: "30px" }}
            value={activeOctave}
            min={0}
            max={8}
            type="number"
            onChange={(e) => setOctave(e.target.value as Octave)}
          />{" "}
        </span>
        <main className='h-full flex items-center sm-no-center'>
          <div className="flex flex-row bg-gray-500 p-2">
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
        </main>

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
