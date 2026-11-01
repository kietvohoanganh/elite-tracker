import { runOcrTask } from './ocrTask';

// All OCR assets ship with the app, including language data. No AI credentials
// or third-party requests are needed to import a workout screenshot.
async function prepareImage(imageBase64, mimeType) {
  const image = new Image();
  image.src = `data:${mimeType};base64,${imageBase64}`;
  await image.decode();
  const scale = Math.min(3, 2400 / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const context = canvas.getContext('2d');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const sample = document.createElement('canvas');
  sample.width = sample.height = 32;
  const sampleContext = sample.getContext('2d', { willReadFrequently: true });
  sampleContext.drawImage(canvas, 0, 0, 32, 32);
  const { data } = sampleContext.getImageData(0, 0, 32, 32);
  let brightness = 0;
  for (let i = 0; i < data.length; i += 4) {
    brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
  }
  if (brightness / (32 * 32) < 128) {
    context.globalCompositeOperation = 'difference';
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'source-over';
  }
  sample.width = sample.height = 0;
  return canvas;
}

export async function recognizeWorkoutImage(imageBase64, mimeType, { signal } = {}) {
  signal?.throwIfAborted();
  const { createWorker, PSM } = await import('tesseract.js');
  signal?.throwIfAborted();
  const assetRoot = new URL(`${import.meta.env.BASE_URL}ocr/`, window.location.href).href;
  try {
    return await runOcrTask({
      signal,
      prepareImage: () => prepareImage(imageBase64, mimeType),
      releaseImage: canvas => { canvas.width = canvas.height = 0; },
      createWorker: () => createWorker(['eng', 'vie'], 1, {
        workerPath: `${assetRoot}worker.min.js`,
        corePath: assetRoot,
        langPath: assetRoot.replace(/\/$/, ''),
        workerBlobURL: false,
      }),
      parameters: { tessedit_pageseg_mode: PSM.SINGLE_BLOCK },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Local workout OCR failed:', error);
    throw new Error('Could not read this image on your device. Try a clearer, cropped image or enter the template manually.', { cause: error });
  }
}
