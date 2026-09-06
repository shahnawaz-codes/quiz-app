// Naruto Chunin Exam Theme & Cartoon Sound Effects Synthesizer (Web Audio API)

let audioCtx = null;
let bgmOscillators = [];
let bgmInterval = null;
let isPlaying = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Naruto Chunin Exam Battle Theme Melody Notes (E minor pentatonic scale - 138 BPM)
const CHUNIN_MELODY = [
  { note: 329.63, duration: 0.2 }, // E4
  { note: 392.00, duration: 0.2 }, // G4
  { note: 440.00, duration: 0.2 }, // A4
  { note: 493.88, duration: 0.3 }, // B4
  { note: 440.00, duration: 0.2 }, // A4
  { note: 392.00, duration: 0.2 }, // G4
  { note: 329.63, duration: 0.4 }, // E4
  { note: 0,      duration: 0.1 }, // Rest

  { note: 493.88, duration: 0.2 }, // B4
  { note: 587.33, duration: 0.2 }, // D5
  { note: 659.25, duration: 0.3 }, // E5
  { note: 587.33, duration: 0.2 }, // D5
  { note: 493.88, duration: 0.2 }, // B4
  { note: 440.00, duration: 0.4 }, // A4
  { note: 0,      duration: 0.1 }, // Rest

  { note: 659.25, duration: 0.2 }, // E5
  { note: 587.33, duration: 0.2 }, // D5
  { note: 493.88, duration: 0.2 }, // B4
  { note: 440.00, duration: 0.2 }, // A4
  { note: 392.00, duration: 0.3 }, // G4
  { note: 329.63, duration: 0.5 }, // E4
  { note: 0,      duration: 0.2 }, // Rest
];

// Bassline notes
const CHUNIN_BASS = [
  164.81, 164.81, 196.00, 220.00, 164.81, 164.81, 146.83, 164.81
];

export function startChuninExamTheme() {
  if (isPlaying) return;
  const ctx = getAudioContext();
  isPlaying = true;

  let noteIdx = 0;
  let bassIdx = 0;

  const playStep = () => {
    if (!isPlaying) return;

    const item = CHUNIN_MELODY[noteIdx % CHUNIN_MELODY.length];
    const bassFreq = CHUNIN_BASS[bassIdx % CHUNIN_BASS.length];
    noteIdx++;
    bassIdx++;

    // Synth Melody Lead (Sawtooth for anime battle feel)
    if (item.note > 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(item.note, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + item.duration * 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + item.duration);
    }

    // Heavy Bass synth pulse
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(bassGain ? bassFreq : 164.81, ctx.currentTime);
    bassGain.gain.setValueAtTime(0.12, ctx.currentTime);
    bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    bassOsc.connect(bassGain);
    bassGain.connect(ctx.destination);
    bassOsc.start(ctx.currentTime);
    bassOsc.stop(ctx.currentTime + 0.25);
  };

  playStep();
  bgmInterval = setInterval(playStep, 220); // Fast Chunin Exam tempo
}

export function stopChuninExamTheme() {
  isPlaying = false;
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}

export function playButtonSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}

export function playVictorySound() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.3);
    });
  } catch (e) {
    // Ignore
  }
}
