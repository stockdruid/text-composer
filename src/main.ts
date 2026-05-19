import './style.css';
import { renderMarkdown } from './renderer/parseMd';
import { presets, applyPreset } from './theme/presets';
import { exportFrameAsPng } from './export/toPng';

const STORAGE_KEY = 'text-composer:draft';

const DEFAULT_TEXT = `> "You need a manager. A compass to tell you when to eat, when to sleep, when to step out of the rain so you don't freeze to death."
> (네겐 관리자가 필요해. 언제 밥을 먹어야 할지, 언제 자야 할지, 얼어 죽지 않으려면 언제 비를 피해야 할지 지시해 줄 나침반 말이야.)

그의 입술 끝이 유려하게 말려 올라갔다.

> "I will be that compass for you."
> (내가 그 나침반이 되어주지.)`;

const editor = document.querySelector<HTMLTextAreaElement>('#editor')!;
const content = document.querySelector<HTMLElement>('#content')!;
const frame = document.querySelector<HTMLElement>('#frame')!;
const presetSelect = document.querySelector<HTMLSelectElement>('#preset')!;
const ratioSelect = document.querySelector<HTMLSelectElement>('#ratio')!;
const exportBtn = document.querySelector<HTMLButtonElement>('#export')!;

for (const p of presets) {
  const opt = document.createElement('option');
  opt.value = p.id;
  opt.textContent = p.label;
  presetSelect.appendChild(opt);
}
presetSelect.value = presets[0]!.id;
applyPreset(frame, presetSelect.value);

editor.value = localStorage.getItem(STORAGE_KEY) ?? DEFAULT_TEXT;

function refresh(): void {
  content.innerHTML = renderMarkdown(editor.value);
}

editor.addEventListener('input', () => {
  localStorage.setItem(STORAGE_KEY, editor.value);
  refresh();
});

presetSelect.addEventListener('change', () => {
  applyPreset(frame, presetSelect.value);
});

ratioSelect.addEventListener('change', () => {
  frame.dataset.ratio = ratioSelect.value;
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

refresh();
