import test from 'node:test';
import assert from 'node:assert/strict';
import { runOcrTask } from './ocrTask.js';

function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}

function workerFixture() {
  let terminated = 0;
  let recognized = 0;
  const worker = {
    setParameters: async () => {},
    recognize: async () => { recognized++; return { data: { text: 'Bench Press 3 x 8' } }; },
    terminate: async () => { terminated++; },
  };
  return { worker, counts: () => ({ terminated, recognized }) };
}

test('OCR success returns text and releases worker and image', async () => {
  const { worker, counts } = workerFixture();
  let released = false;
  const text = await runOcrTask({ createWorker: async () => worker, prepareImage: async () => ({}), releaseImage: () => { released = true; } });
  assert.equal(text, 'Bench Press 3 x 8');
  assert.deepEqual(counts(), { terminated: 1, recognized: 1 });
  assert.equal(released, true);
});

test('closing import stops active recognition without waiting for its result', async () => {
  const { worker, counts } = workerFixture();
  const started = deferred();
  const unfinished = deferred();
  worker.recognize = () => { started.resolve(); return unfinished.promise; };
  const controller = new AbortController();
  const task = runOcrTask({ createWorker: async () => worker, prepareImage: async () => ({}), signal: controller.signal });
  await started.promise;
  controller.abort();
  await assert.rejects(task, { name: 'AbortError' });
  assert.equal(counts().terminated, 1);
});

test('cancellation during initialization also terminates the late worker', async () => {
  const { worker, counts } = workerFixture();
  const initializing = deferred();
  const ready = deferred();
  const controller = new AbortController();
  const task = runOcrTask({
    createWorker: () => { initializing.resolve(); return ready.promise; },
    prepareImage: async () => ({}), signal: controller.signal,
  });
  await initializing.promise;
  controller.abort();
  await assert.rejects(task, { name: 'AbortError' });
  ready.resolve(worker);
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(counts(), { terminated: 1, recognized: 0 });
});

test('already aborted requests do not decode images or start workers', async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(runOcrTask({
    createWorker: () => assert.fail('must not start'),
    prepareImage: () => assert.fail('must not decode'), signal: controller.signal,
  }), { name: 'AbortError' });
});

test('OCR errors and timeouts terminate workers', async () => {
  for (const mode of ['failure', 'timeout']) {
    const { worker, counts } = workerFixture();
    worker.recognize = () => mode === 'failure' ? Promise.reject(new Error('OCR failure')) : new Promise(() => {});
    await assert.rejects(runOcrTask({ createWorker: async () => worker, prepareImage: async () => ({}), timeoutMs: 10 }));
    assert.equal(counts().terminated, 1);
  }
});
