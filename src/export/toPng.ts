import { toPng } from 'html-to-image';

export async function exportFrameAsPng(
  frame: HTMLElement,
  filename = 'text-composer.png',
): Promise<void> {
  const dataUrl = await toPng(frame, {
    pixelRatio: 3,
    cacheBust: true,
    backgroundColor: getComputedStyle(frame).backgroundColor,
  });
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
