// @ts-disable

import { useCallback, useEffect, useState } from "react";
import { Song, Track, Instrument, Effect } from "reactronica";

const Keyboard = ({
  octave,
  onMouseDown,
  onMouseUp,
}: {
  octave: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
  onMouseDown: (e: any) => void;
  onMouseUp: () => void;
}) => {
  const handleMouseDown = (e: any) => {
    console.log({ note: e.target.name });
    onMouseDown([{ name: e.target.name }]);
  };

  // note octave
  // C<#> 3
  const withOctave = (note: string, upOctave = false) => {
    const output = note.includes("#")
      ? `${note.replace("#", "")}${octave}#`
      : `${note}${Number(octave) + Number(upOctave)}`;
    return output;
  };

  return (
    <div style={{ display: "flex" }}>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={onMouseUp}
        name={withOctave("C")}
      >
        {withOctave("C")}
      </button>
      <button
        style={{ marginBottom: "20px" }}
        onMouseDown={handleMouseDown}
        onMouseUp={onMouseUp}
        name={withOctave("C#")}
      >
        {withOctave("C#")}
      </button>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={onMouseUp}
        name={`D${octave}`}
      >
        {withOctave("D")}
      </button>
      <button
        style={{ marginBottom: "20px" }}
        onMouseDown={handleMouseDown}
        onMouseUp={onMouseUp}
        name={withOctave(`D#`)}
      >
        {withOctave("D#")}
      </button>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={onMouseUp}
        name={withOctave("E")}
      >
        {withOctave("E")}
      </button>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={onMouseUp}
        name={withOctave("F")}
      >
        {withOctave("F")}
      </button>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={onMouseUp}
        name={withOctave("G")}
      >
        {withOctave("G")}
      </button>
      <button
        style={{ marginBottom: "20px" }}
        onMouseDown={handleMouseDown}
        onMouseUp={onMouseUp}
        name={withOctave("G#")}
      >
        {withOctave("G#")}
      </button>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={onMouseUp}
        name={withOctave("A")}
      >
        {withOctave("A")}
      </button>
      <button
        style={{ marginBottom: "20px" }}
        onMouseDown={handleMouseDown}
        onMouseUp={onMouseUp}
        name={withOctave("A#")}
      >
        {withOctave("A#")}
      </button>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={onMouseUp}
        name={withOctave("B")}
      >
        {withOctave("B")}
      </button>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={onMouseUp}
        name={withOctave("C", true)}
      >
        {withOctave("C", true)}
      </button>
    </div>
  );
};
const useMidi = () => {
  const onMIDISuccess = useCallback((midiAccess: any) => {
    console.log(midiAccess);

    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;

    const noteOn = (note: any, velocity: any) => {
      console.log({ note, velocity });
    };
    const noteOff = (note: any) => {
      console.log({ note });
    };

    function getMIDIMessage(message: any) {
      var command = message.data[0];
      var note = message.data[1];
      var velocity = message.data.length > 2 ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

      switch (command) {
        case 144: // noteOn
          if (velocity > 0) {
            noteOn(note, velocity);
          } else {
            noteOff(note);
          }
          break;
        case 128: // noteOff
          noteOff(note);
          break;
        // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
      }
    }

    // function getMIDIMessage(message) {
    //   console.log(message);
    // }

    for (var input of midiAccess.inputs.values()) {
      input.onmidimessage = getMIDIMessage;
    }

    console.log({ inputs, outputs });
  }, []);

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
};

// const inter = Inter({ subsets: ['latin'] })
const KeyboardAudio = () => {
  useMidi();
  const [notes, setNotes] = useState([]);
  console.log({ notes });
  return (
    <>
      <Keyboard
        octave="0"
        onMouseDown={(notes) => setNotes(notes)}
        onMouseUp={() => setNotes([])}
      />
      <Keyboard
        octave="1"
        onMouseDown={(notes) => setNotes(notes)}
        onMouseUp={() => setNotes([])}
      />
      <Keyboard
        octave="2"
        onMouseDown={(notes) => setNotes(notes)}
        onMouseUp={() => setNotes([])}
      />
      <Keyboard
        octave="3"
        onMouseDown={(notes) => setNotes(notes)}
        onMouseUp={() => setNotes([])}
      />
      <Keyboard
        octave="4"
        onMouseDown={(notes) => setNotes(notes)}
        onMouseUp={() => setNotes([])}
      />
      <Keyboard
        octave="5"
        onMouseDown={(notes) => setNotes(notes)}
        onMouseUp={() => setNotes([])}
      />
      <Keyboard
        octave="6"
        onMouseDown={(notes) => setNotes(notes)}
        onMouseUp={() => setNotes([])}
      />
      <Keyboard
        octave="7"
        onMouseDown={(notes) => setNotes(notes)}
        onMouseUp={() => setNotes([])}
      />
      <Keyboard
        octave="8"
        onMouseDown={(notes) => setNotes(notes)}
        onMouseUp={() => setNotes([])}
      />

      {JSON.stringify(notes[0])}
      <Song>
        <Track>
          <Instrument key={1} type="amSynth" notes={notes} />
        </Track>
      </Song>
    </>
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
