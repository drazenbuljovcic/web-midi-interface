import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

import { Octave } from "../types/music";

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
