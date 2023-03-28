import { Octave } from "../types/music";

// C<#> 3
export const getNoteWithOctave = (
  note: string,
  octave: Octave,
  upOctave = false
) => {
  const output = note.includes("#")
    ? `${note}${octave}`
    : `${note}${Number(octave) + Number(upOctave)}`;
  return output;
};
