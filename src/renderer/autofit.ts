/**
 * Shrink content font-size until it fits inside container's *content box*
 * (excluding padding), with a floor. Returns { fontSize, overflow } where
 * overflow=true means content still exceeds available area at MIN_FS.
 */

export const MIN_FS = 11;
export const MAX_FS = 17;
const ITERATIONS = 10;

export type FitResult = { fontSize: number; overflow: boolean };

function getAvailable(container: HTMLElement): { w: number; h: number } {
  const cs = getComputedStyle(container);
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  return {
    w: container.clientWidth - padX,
    h: container.clientHeight - padY,
  };
}

function fits(content: HTMLElement, avail: { w: number; h: number }): boolean {
  return content.scrollHeight <= avail.h && content.scrollWidth <= avail.w;
}

export function autofit(
  content: HTMLElement,
  container: HTMLElement,
): FitResult {
  const avail = getAvailable(container);

  content.style.setProperty('--content-fs', `${MAX_FS}px`);
  if (fits(content, avail)) {
    return { fontSize: MAX_FS, overflow: false };
  }

  let lo = MIN_FS;
  let hi = MAX_FS;
  let best = MIN_FS;
  for (let i = 0; i < ITERATIONS; i++) {
    const mid = (lo + hi) / 2;
    content.style.setProperty('--content-fs', `${mid}px`);
    if (fits(content, avail)) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  const finalFs = Math.max(MIN_FS, best);
  content.style.setProperty('--content-fs', `${finalFs}px`);
  const overflow = !fits(content, avail);
  return { fontSize: finalFs, overflow };
}
