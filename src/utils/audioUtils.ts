let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function playTone(
  value: number,
  maxValue: number,
  duration: number = 50
): void {
  const ctx = getAudioContext();

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const frequency = 200 + (value / maxValue) * 600;
  const durationSec = duration / 1000;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + durationSec * 0.1);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + durationSec);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + durationSec);
}
