import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import { useOctave } from "./state/octave";
import { Octave } from "./types/music";

export const useOctaveForComputerKeyboard = (): {
  octave: Octave;
  setOctave: (octave: Octave) => void;
} => {
  const { octave, setOctave } = useOctave();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "x") {
        setOctave((prev) => {
          const next = Number(prev) + 1;
          return next > 7 ? "7" : (next.toString() as Octave);
        });
      }
      if (e.key.toLowerCase() === "z") {
        setOctave((prev) => {
          const next = Number(prev) - 1;
          return next < 0 ? "0" : (next.toString() as Octave);
        });
      }
    },
    [setOctave]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {}, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { octave, setOctave };
};
