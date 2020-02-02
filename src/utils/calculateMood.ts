import { max, min } from "lodash";
import natural from "natural";
import negativeWords from "../words/negative.json";
import positiveWords from "../words/positive.json";
const tokenizer = new natural.WordTokenizer();

/*
    Moods:
    C Major - Happy (more variables)
    C Minor - Sad, Love sick (ifs, function declarations)
    D Minor - Sad (falsy)
    D Major - Triumphant (returns)
    Eb Major - Love, Talk to God (globals, windows)
    E Major - Ready to fight (try catches)
    F Minor - funereal, deep depression (process.exit)
    G Major - Fantasy (strings, numbers)
    G Minor - Discontent, Uneasiness (throws)
    A Major - Declaration of love (imports, exports)
*/

const octave = 2;

// const moods = {
//   5: `A${octave} major`,
//   4: `G${octave} major`,
//   3: `Eb${octave} major`,
//   2: `D${octave} major`,
//   1: `E${octave} major`,
//   0: `C${octave} major`,
//   "-1": `C${octave} minor`,
//   "-2": `D${octave} minor`,
//   "-3": `G${octave} minor`,
//   "-4": `F${octave} minor`
// };

const moods = {
  5: `A${octave} major`,
  4: `G${octave} major`,
  3: `Eb${octave} major`,
  2: `D${octave} major`,
  1: `E${octave} major`,
  0: `C${octave} major`,
  "-1": `C${octave} minor`,
  "-2": `D${octave} minor`,
  "-3": `G${octave} minor`,
  "-4": `F${octave} minor`
};

const calculateMood = (source: string) => {
  const words = tokenizer.tokenize(source);
  let positives = 0;
  let negatives = 0;
  for (const word of words) {
    if (positiveWords.includes(word.toLowerCase())) {
      positives++;
    } else if (negativeWords.includes(word.toLowerCase())) {
      negatives++;
    }
  }
  let mood = positives - negatives;
  const moods_values = Object.keys(moods).map(k => parseInt(k));
  const maxValue = max(moods_values) as number;
  const minValue = min(moods_values) as number;
  mood = Math.max(minValue, Math.min(maxValue, mood));
  return moods[mood.toString()];
};

export default calculateMood;
