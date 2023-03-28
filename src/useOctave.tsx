import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import {} from "vm";
import { Octave } from "./types/music";

const OctaveContext = createContext<{
  octave: Octave;
  setOctave: Dispatch<SetStateAction<Octave>>;
}>({
  octave: "0",
  setOctave: () => {},
});

export const useOctave = () => {
  const octave = useContext(OctaveContext);

  if (octave === undefined) {
    throw new Error("Provide the octave to your app!");
  }

  return octave;
};

const OctaveProvider = ({ children }: { children: ReactNode }) => {
  const [octave, setOctave] = useState<Octave>("0");

  return (
    <OctaveContext.Provider value={{ octave, setOctave }}>
      {children}
    </OctaveContext.Provider>
  );
};

export const withOctave = (Component: any) => {
  const ComponentWithOctave = (props: {}) => (
    <OctaveProvider>
      <Component {...props} />
    </OctaveProvider>
  );
  return ComponentWithOctave;
};

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
