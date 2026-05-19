import './style.css';
import { renderMarkdown } from './renderer/parseMd';
import { autofit, MIN_FS } from './renderer/autofit';
import { presets, applyPreset } from './theme/presets';
import { exportFrameAsPng } from './export/toPng';

const STORAGE_KEY = 'text-composer:draft';
const FONT_KEY = 'text-composer:font';
const SIZE_KEY = 'text-composer:size';

const DEFAULT_TEXT = `> "You need a manager. A compass to tell you when to eat, when to sleep, when to step out of the rain so you don't freeze to death."
> (네겐 관리자가 필요해. 언제 밥을 먹어야 할지, 언제 자야 할지, 얼어 죽지 않으려면 언제 비를 피해야 할지 지시해 줄 나침반 말이야.)

그의 입술 끝이 유려하게 말려 올라갔다.

> "I will be that compass for you."
> (내가 그 나침반이 되어주지.)`;

const editor = document.querySelector<HTMLTextAreaElement>('#editor')!;
const content = document.querySelector<HTMLElement>('#content')!;
const frame = document.querySelector<HTMLElement>('#frame')!;
const glassCard = frame.querySelector<HTMLElement>('.glass-card')!;
const presetSelect = document.querySelector<HTMLSelectElement>('#preset')!;
const fontSelect = document.querySelector<HTMLSelectElement>('#font')!;
const sizeSelect = document.querySelector<HTMLSelectElement>('#size')!;
const ratioSelect = document.querySelector<HTMLSelectElement>('#ratio')!;
const exportBtn = document.querySelector<HTMLButtonElement>('#export')!;
const charCounter = document.querySelector<HTMLElement>('#char-counter')!;

for (const p of presets) {
  const opt = document.createElement('option');
  opt.value = p.id;
  opt.textContent = p.label;
  presetSelect.appendChild(opt);
}
presetSelect.value = presets[0]!.id;
applyPreset(frame, presetSelect.value);

function applyFont(value: string): void {
  if (value) frame.dataset.font = value;
  else delete frame.dataset.font;
}

const savedFont = localStorage.getItem(FONT_KEY) ?? '';
fontSelect.value = savedFont;
applyFont(savedFont);

const savedSize = localStorage.getItem(SIZE_KEY);
if (savedSize) sizeSelect.value = savedSize;

editor.value = localStorage.getItem(STORAGE_KEY) ?? DEFAULT_TEXT;

let scheduled = 0;
function scheduleRefit(): void {
  cancelAnimationFrame(scheduled);
  scheduled = requestAnimationFrame(() => {
    const maxFs = parseFloat(sizeSelect.value) || 13;
    const { fontSize, overflow } = autofit(content, glassCard, maxFs);
    const count = editor.value.length;
    charCounter.textContent = overflow
      ? `${count}자 · 넘침`
      : `${count}자 · ${fontSize.toFixed(0)}px`;
    charCounter.classList.toggle('is-overflow', overflow);
  });
}

function refresh(): void {
  content.innerHTML = renderMarkdown(editor.value);
  scheduleRefit();
}

editor.addEventListener('input', () => {
  localStorage.setItem(STORAGE_KEY, editor.value);
  refresh();
});

presetSelect.addEventListener('change', () => {
  applyPreset(frame, presetSelect.value);
  scheduleRefit();
});

fontSelect.addEventListener('change', () => {
  const v = fontSelect.value;
  applyFont(v);
  localStorage.setItem(FONT_KEY, v);
  // Wait one tick so swapped font metrics are applied before refit
  requestAnimationFrame(scheduleRefit);
});

sizeSelect.addEventListener('change', () => {
  localStorage.setItem(SIZE_KEY, sizeSelect.value);
  scheduleRefit();
});

ratioSelect.addEventListener('change', () => {
  frame.dataset.ratio = ratioSelect.value;
  scheduleRefit();
});

exportBtn.addEventListener('click', async () => {
  exportBtn.disabled = true;
  const original = exportBtn.textContent;
  exportBtn.textContent = '저장 중…';
  try {
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    await exportFrameAsPng(frame, `text-composer-${ts}.png`);
  } catch (err) {
    console.error(err);
    alert('이미지 저장 실패. 콘솔 확인.');
  } finally {
    exportBtn.textContent = original;
    exportBtn.disabled = false;
  }
});

// Refit on viewport changes (glass-card size depends on frame which depends on viewport)
const ro = new ResizeObserver(scheduleRefit);
ro.observe(glassCard);
window.addEventListener('resize', scheduleRefit);

refresh();

console.log(`[text-composer] min font-size: ${MIN_FS}px`);
