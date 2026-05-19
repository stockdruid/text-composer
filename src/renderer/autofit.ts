/**
 * Shrink content font-size until it fits inside container's *content box*
 * (excluding padding), with a floor. Returns { fontSize, overflow } where
 * overflow=true means content still exceeds available area at MIN_FS.
 */

export const MIN_FS = 8;
export const MAX_FS = 13;
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
  maxFs: number = MAX_FS,
  minFs: number = MIN_FS,
): FitResult {
  const avail = getAvailable(container);

  content.style.setProperty('--content-fs', `${maxFs}px`);
  if (fits(content, avail)) {
    return { fontSize: maxFs, overflow: false };
  }

  let lo = minFs;
  let hi = maxFs;
  let best = minFs;
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

  const finalFs = Math.max(minFs, best);
  content.style.setProperty('--content-fs', `${finalFs}px`);
  const overflow = !fits(content, avail);
  return { fontSize: finalFs, overflow };
}
