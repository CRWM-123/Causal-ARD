import { getDocument, GlobalWorkerOptions, PDFWorker } from './vendor/pdfjs/pdf.min.mjs';

GlobalWorkerOptions.workerSrc = new URL('./vendor/pdfjs/pdf.worker.min.mjs', import.meta.url).href;

const worker = new PDFWorker();
const states = new Map();
const queue = [];
let activeRenders = 0;

for (const figure of document.querySelectorAll('.pdf-figure[data-pdf]')) {
  states.set(figure, { figure, queued: false, running: false, visible: false });
}

function enqueue(state) {
  if (state.queued || state.running) return;
  state.queued = true;
  queue.push(state);
  drainQueue();
}

function drainQueue() {
  while (activeRenders < 2 && queue.length) {
    const state = queue.shift();
    state.queued = false;
    state.running = true;
    activeRenders += 1;
    renderFigure(state).finally(() => {
      state.running = false;
      activeRenders -= 1;
      const width = state.figure.clientWidth;
      if (state.width && Math.abs(state.width - width) > 1) enqueue(state);
      drainQueue();
    });
  }
}

async function renderFigure(state) {
  const { figure } = state;
  try {
    state.document ??= getDocument({
      url: new URL(figure.dataset.pdf, document.baseURI).href,
      worker,
      standardFontDataUrl: new URL('./vendor/pdfjs/standard_fonts/', import.meta.url).href,
    }).promise;
    const pdf = await state.document;
    const page = await pdf.getPage(1);
    const original = page.getViewport({ scale: 1 });
    const width = figure.clientWidth;
    if (!width) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 3);
    const viewport = page.getViewport({ scale: width * ratio / original.width });
    const canvas = figure.querySelector('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    figure.style.setProperty('--figure-ratio', `${original.width} / ${original.height}`);

    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    state.width = width;
    figure.classList.add('is-rendered');
  } catch (error) {
    // The figure's link remains usable when inline PDF rendering is unavailable.
    figure.classList.add('has-pdf-error');
    console.warn('Could not render paper figure:', figure.dataset.pdf, error);
  }
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const state = states.get(entry.target);
      state.visible = true;
      enqueue(state);
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '400px' });
  for (const figure of states.keys()) observer.observe(figure);
} else {
  for (const state of states.values()) {
    state.visible = true;
    enqueue(state);
  }
}

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    for (const state of states.values()) {
      if (state.visible) enqueue(state);
    }
  }, 200);
});
