/**
 * Shrink content font-size until it fits inside container, with a floor.
 * Returns { fontSize, overflow } where overflow=true means content still
 * exceeds the container even at MIN_FS.
 */

export const MIN_FS = 11;
export const MAX_FS = 15;
const ITERATIONS = 10;

export type FitResult = { fontSize: number; overflow: boolean };

function fits(content: HTMLElement, container: HTMLElement): boolean {
  return (
    content.scrollHeight <= container.clientHeight &&
    content.scrollWidth <= container.clientWidth
  );
}

export function autofit(
  content: HTMLElement,
  container: HTMLElement,
): FitResult {
  // Binary search: largest font-size that fits, clamped to [MIN, MAX].
  let lo = MIN_FS;
  let hi = MAX_FS;
  let best = MIN_FS;

  content.style.setProperty('--content-fs', `${MAX_FS}px`);
  if (fits(content, container)) {
    return { fontSize: MAX_FS, overflow: false };
  }

  for (let i = 0; i < ITERATIONS; i++) {
    const mid = (lo + hi) / 2;
    content.style.setProperty('--content-fs', `${mid}px`);
    if (fits(content, container)) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  const finalFs = Math.max(MIN_FS, best);
  content.style.setProperty('--content-fs', `${finalFs}px`);
  const overflow = !fits(content, container);
  return { fontSize: finalFs, overflow };
}
