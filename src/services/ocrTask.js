// Terminate abandoned OCR jobs, including a worker that finishes initializing
// after cancellation. Keeping this separate makes lifecycle behavior testable.
export async function runOcrTask({ createWorker, prepareImage, releaseImage = () => {}, signal, timeoutMs = 90000, parameters }) {
  let worker;
  let image;
  let stopped = false;
  let termination;
  let timeout;
  let abort;
  const terminate = () => {
    if (worker && !termination) {
      termination = Promise.resolve(worker.terminate()).catch(error => console.warn('OCR cleanup failed:', error));
    }
    return termination;
  };
  const cancelled = new Promise((_, reject) => {
    const stop = (error) => {
      stopped = true;
      terminate();
      reject(error);
    };
    abort = () => stop(new DOMException('Image reading cancelled.', 'AbortError'));
    signal?.addEventListener('abort', abort, { once: true });
    timeout = setTimeout(() => stop(new Error('Reading this image took too long. Crop it to the workout table and try again.')), timeoutMs);
    if (signal?.aborted) abort();
  });
  const recognize = async () => {
    if (stopped) return '';
    image = await prepareImage();
    if (stopped) {
      releaseImage(image);
      return '';
    }
    worker = await createWorker();
    if (stopped) {
      await terminate();
      return '';
    }
    await worker.setParameters(parameters);
    if (stopped) return '';
    const { data } = await worker.recognize(image);
    return data.text;
  };
  try {
    return await Promise.race([cancelled, recognize()]);
  } finally {
    stopped = true;
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
    await terminate();
    if (image) releaseImage(image);
  }
}
