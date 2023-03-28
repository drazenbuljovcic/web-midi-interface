import { useCallback, useEffect } from "react";

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

export default useMidi;
