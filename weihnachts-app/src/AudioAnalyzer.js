import { analyze } from "web-audio-beat-detector";

export async function getTrackPeaks(buffer) {
  const tempo = await analyze(buffer);

  console.log("Web audio beat detector: ", tempo);

  let offlineCtx = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
  let source = offlineCtx.createBufferSource();
  source.buffer = buffer;
  let filter = offlineCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 440;
  source.connect(filter);
  filter.connect(offlineCtx.destination);
  source.start(0);
  offlineCtx.startRendering();
  return new Promise((resolve, reject) => {
    offlineCtx.oncomplete = (buffer) => {
      resolve(processAudioBuffer(buffer, tempo));
    };
  });
}

function processAudioBuffer(e, tempo) {
  let filteredBuffer = e.renderedBuffer;
  //If you want to analyze both channels, use the other channel later
  let data = filteredBuffer.getChannelData(0);

  let max = data.reduce((maxV, val) => Math.max(maxV, val), 0);
  let min = data.reduce((minV, val) => Math.min(minV, val), 0);
  let threshold = min + (max - min) * 0.75;

  const final_peaks = getBpmPeaks(data, threshold, tempo);
  console.log("Final peaks:", final_peaks);
  return final_peaks;
}
/**********************************************************/

function getBpmPeaks(data, threshold, bpm) {
  let peaksArray = [];
  let length = data.length;
  const breakDuration = 22050;

  let windowsSizeHalf = Math.round(bpm / 2);
  let windowSize = windowsSizeHalf * 2 + 1;
  let window = [];
  let maxIndex = 0;
  let maxValue = 0;
  for (let i = 0; i < length; i++) {
    let newValue = data[i];

    if (newValue > maxValue) {
      maxIndex = i;
      maxValue = newValue;
    }
    window.push(newValue);

    if (window.length > windowSize) {
      const oldValue = window.shift();
      if (oldValue === maxValue) {
        maxValue = Math.max(...window);
        maxIndex = i - (windowSize - window.indexOf(maxValue));
      }
    }

    if (i - windowsSizeHalf === maxIndex && maxValue > threshold) {
      peaksArray.push(i - windowsSizeHalf);
      peaksArray.push(i - windowsSizeHalf + breakDuration);
    }
  }
  return peaksArray;
}
