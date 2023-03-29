import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { NoteType } from "../types/music";

const NotesContext = createContext<{
  notes: NoteType[];
  activateNote: (note: NoteType["name"]) => void;
  deactivateNote: (note: NoteType["name"]) => void;
}>({
  notes: [],
  activateNote: () => {},
  deactivateNote: () => {},
});

const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [noteMap, setNotes] = useState<Map<NoteType["name"], NoteType>>(
    new Map()
  );
  const notes = useMemo(() => [...noteMap.values()], [noteMap]);

  const activateNote = useCallback(
    (note: NoteType["name"]) =>
      setNotes((currentlyActive) => {
        const newActive = new Map(currentlyActive);
        newActive.set(note, { name: note });
        return newActive;
      }),
    []
  );

  const deactivateNote = useCallback(
    (note: NoteType["name"]) =>
      setNotes((currentlyActive) => {
        const newActive = new Map(currentlyActive);
        newActive.delete(note);
        return newActive;
      }),
    []
  );

  return (
    <NotesContext.Provider value={{ notes, activateNote, deactivateNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const withNotes = (Component: any) => {
  const ComponentWithNotes = (props: {}) => (
    <NotesProvider>
      <Component {...props} />
    </NotesProvider>
  );
  return ComponentWithNotes;
};

export const useNotes = () => {
  const notes = useContext(NotesContext);

  if (notes === undefined) {
    throw new Error("Please wrap your midi device into the Notes context");
  }

  return notes;
};
