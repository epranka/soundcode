import { note as parseNote } from "@tonaljs/tonal";

const getChordHarmonic = (chord: string[]) => {
  const notes: string[] = [];
  for (let note of chord) {
    const parsed = parseNote(note);
    notes.push(parsed.pc + "4");
  }
  for (let note of chord) {
    const parsed = parseNote(note);
    notes.push(parsed.pc + "5");
  }
  return notes;
};

export default getChordHarmonic;
