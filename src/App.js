import React, { useState, useEffect } from "react";
import scribble, {
  scale,
  scales,
  clip,
  midi,
  getChordsByProgression,
  progression
} from "scribbletune";
import "./styles.css";

const chordsInKeys = {
  "C major": ["CM", "Dm", "Em", "FM", "GM", "Am"],
  "C# major": ["C#M", "D#m", "E#m", "F#M", "G#M", "A#m"],
  "D major": ["DM", "Em", "F#m", "GM", "AM", "Bm"],
  "D# major": ["D#M", "Fm", "Gm", "G#M", "B#M", "Cm"],
  "E major": ["EM", "F#m", "G#m", "AM", "BM", "C#m"],
  "F major": ["FM", "Gm", "Am", "BbM", "CM", "Dm"],
  "F# major": ["F#M", "G#m", "A#m", "BM", "C#M", "D#m"],
  "G major": ["GM", "Am", "Bm", "CM", "DM", "Em"],
  "G# major": ["G#M", "Bbm", "Cm", "DbM", "EbM", "Fm"],
  "A major": ["AM", "Bm", "C#m", "DM", "EM", "F#m"],
  "A# major": ["A#M", "Cm", "Dm", "EbM", "FM", "Gm"],
  "B major": ["BM", "C#m", "D#m", "EM", "FM", "G#m"],

  "C minor": ["CM", "Dm", "Em", "FM", "GM", "Am"],
  "C# minor": ["C#M", "D#m", "E#m", "F#M", "G#M", "A#m"],
  "D minor": ["DM", "Em", "F#m", "GM", "AM", "Bm"],
  "D# minor": ["D#M", "Fm", "Gm", "G#M", "B#M", "Cm"],
  "E minor": ["EM", "F#m", "G#m", "AM", "BM", "C#m"],
  "F minor": ["FM", "Gm", "Am", "BbM", "CM", "Dm"],
  "F# minor": ["F#M", "G#m", "A#m", "BM", "C#M", "D#m"],
  "G minor": ["GM", "Am", "Bm", "CM", "DM", "Em"],
  "G# minor": ["G#M", "Bbm", "Cm", "DbM", "EbM", "Fm"],
  "A minor": ["AM", "Bm", "C#m", "DM", "EM", "F#m"],
  "A# minor": ["A#M", "Cm", "Dm", "EbM", "FM", "Gm"],
  "B minor": ["BM", "C#m", "D#m", "EM", "FM", "G#m"]
};

const keys = Object.keys(chordsInKeys);

const chordSymbols = ["I", "ii", "iii", "IV", "V", "vi"];

const getRandomKeyOf = () => {
  return keys[Math.floor(keys.length * Math.random())];
};

const getRandomChordNumbers = (length = 5) => {
  return Array.from(new Array(length)).map(() => Math.ceil(6 * Math.random()));
};

export default function App() {
  const [keyOf, setKeyOf] = useState("");
  const [chordNumbers, setChordNumbers] = useState([]);
  const [progressionLength, setProgressionLength] = useState(6);
  const [clip, setClip] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const chordNames =
    keyOf && chordNumbers
      ? chordNumbers.map((chordNumber) => chordsInKeys[keyOf][chordNumber - 1])
      : [];

  const handleGenerate = () => {
    const key = getRandomKeyOf();
    const chordNumbers = getRandomChordNumbers(progressionLength);
    setChordNumbers(chordNumbers);
    setKeyOf(key);
  };

  const handleDecrementProgressionLength = () =>
    setProgressionLength(progressionLength - 1 || 1);

  const handleIncrementProgressionLength = () =>
    setProgressionLength(progressionLength + 1);

  const handlePlay = () => {
    setIsPlaying(true);

    console.log("progression", progression("minor", progressionLength));

    const scribbleClip = scribble.clip({
      instrument: "Synth", // new property: synth
      pattern: "x",
      notes: chordNames
      // notes: getChordsByProgression("C4 major")
    });

    setClip(scribbleClip);

    scribbleClip.start();

    //scribble
    //  .clip({
    //    // Use chord names directly in the notes array
    //    // M stands for Mor, m stands for mor
    //    notes: "CM FM GM CM",
    //    pattern: "x---".repeat(4)
    //  })
    //  .start();

    //midi(chordsClip, "chords.mid");

    Tone.context.resume().then(() => Tone.Transport.start());
  };

  const handleStop = () => {
    setIsPlaying(false);
    clip.stop();
    Tone.context.resume().then(() => Tone.Transport.stop());
  };

  const handleExport = () => {
    console.log("clip", clip);
    const data = scribble.midi(
      scribble.clip({
        instrument: "Synth", // new property: synth
        pattern: "x",
        notes: chordNames
      })
    );
  };

  useEffect(() => {}, []);

  return (
    <div className="App">
      <div>
        <button onClick={handleGenerate}>generate</button>
      </div>
      <div>
        <button onClick={handleDecrementProgressionLength}>-</button>
        {progressionLength}
        <button onClick={handleIncrementProgressionLength}>+</button>
      </div>
      {chordNumbers.length > 0 && <h1>Scale: {keyOf}</h1>}
      {keyOf && (
        <>
          <h1>Chord Progression:</h1>
          {chordNumbers.map((chordIndex) => (
            <p>
              {chordIndex} {chordSymbols[chordIndex - 1]}{" "}
              {chordsInKeys[keyOf][chordIndex - 1]}
            </p>
          ))}
          <div>
            <button onClick={handlePlay} disabled={isPlaying}>
              play
            </button>
            <button onClick={handleStop}>stop</button>
            <button onClick={handleExport}>export</button>
          </div>
        </>
      )}
    </div>
  );
}
