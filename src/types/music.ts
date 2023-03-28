export type NoteType = {
  name: string;
  velocity?: number;
  duration?: number | string;
  /** Use unique key to differentiate from same notes, otherwise it won't play */
  key?: string | number;
};

export type Octave = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
