import { mkdir, copyFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const destination = path.join(root, 'public/ocr');
await mkdir(destination, { recursive: true });
await copyFile(path.join(root, 'node_modules/tesseract.js/dist/worker.min.js'), path.join(destination, 'worker.min.js'));
const core = path.join(root, 'node_modules/tesseract.js-core');
for (const file of await readdir(core)) {
  if (/\.wasm(?:\.js)?$/.test(file)) await copyFile(path.join(core, file), path.join(destination, file));
}
for (const language of ['eng', 'vie']) {
  await copyFile(
    path.join(root, `node_modules/@tesseract.js-data/${language}/4.0.0_best_int/${language}.traineddata.gz`),
    path.join(destination, `${language}.traineddata.gz`),
  );
}
console.log('Bundled offline OCR worker, WASM and English/Vietnamese data.');
