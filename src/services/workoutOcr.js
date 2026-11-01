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
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  let brightness = 0;
  for (let i = 0; i < pixels.data.length; i += 4) {
    brightness += (pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3;
  }
  // Tesseract reads dark screenshot tables more reliably as dark text on white.
  if (brightness / (canvas.width * canvas.height) < 128) {
    for (let i = 0; i < pixels.data.length; i += 4) {
      pixels.data[i] = 255 - pixels.data[i];
      pixels.data[i + 1] = 255 - pixels.data[i + 1];
      pixels.data[i + 2] = 255 - pixels.data[i + 2];
    }
    context.putImageData(pixels, 0, 0);
  }
  return canvas;
}

export async function recognizeWorkoutImage(imageBase64, mimeType) {
  const { createWorker, PSM } = await import('tesseract.js');
  const assetRoot = new URL(`${import.meta.env.BASE_URL}ocr/`, window.location.href).href;
  let worker;
  let expired = false;
  let timeout;
  const recognize = async () => {
    const image = await prepareImage(imageBase64, mimeType);
    if (expired) return '';
    worker = await createWorker(['eng', 'vie'], 1, {
      workerPath: `${assetRoot}worker.min.js`,
      corePath: assetRoot,
      langPath: assetRoot.replace(/\/$/, ''),
      workerBlobURL: false,
    });
    if (expired) {
      await worker.terminate();
      return '';
    }
    // Preserve rows in workout tables rather than reading each column separately.
    await worker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_BLOCK });
    const { data } = await worker.recognize(image);
    return data.text;
  };
  try {
    return await Promise.race([
      recognize(),
      new Promise((_, reject) => {
        timeout = window.setTimeout(() => {
          expired = true;
          reject(new Error('Reading this image took too long. Crop it to the workout table and try again.'));
        }, 90000);
      }),
    ]);
  } catch (error) {
    if (expired) throw error;
    console.error('Local workout OCR failed:', error);
    throw new Error('Could not read this image on your device. Try a clearer, cropped image or enter the template manually.', { cause: error });
  } finally {
    window.clearTimeout(timeout);
    if (worker) await worker.terminate();
  }
}
