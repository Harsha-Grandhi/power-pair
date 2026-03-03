export type ShareResult = 'shared' | 'copied' | 'failed';

/**
 * Tries three strategies in order:
 * 1. Native Web Share API  (best on mobile — triggers OS share sheet)
 * 2. Clipboard API         (modern desktop browsers)
 * 3. execCommand fallback  (legacy / restricted contexts)
 */
export async function shareOrCopy(
  text: string,
  url?: string
): Promise<ShareResult> {
  const appUrl =
    url ?? (typeof window !== 'undefined' ? window.location.origin : '');
  const fullText = `${text}\n\n${appUrl}`;

  // 1 — Native share sheet (iOS, Android, some desktop Chrome)
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title: 'Power Pair', text, url: appUrl });
      return 'shared';
    } catch (e) {
      // AbortError = user cancelled → don't fall through to copy
      if ((e as Error).name === 'AbortError') return 'failed';
      // Any other error (permissions, unsupported) → fall through
    }
  }

  // 2 — Clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(fullText);
      return 'copied';
    } catch {
      // blocked or not available → fall through
    }
  }

  // 3 — Legacy execCommand fallback (always works in-browser)
  try {
    const ta = document.createElement('textarea');
    ta.value = fullText;
    ta.style.cssText =
      'position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return 'copied';
  } catch {
    return 'failed';
  }
}

export function getInviteMessage(archetypeName: string): string {
  return `I just discovered I'm a "${archetypeName}" on Power Pair — a relationship intelligence app. Take the 10-min quiz and let's see our couple compatibility! 💑`;
}

/** True if the browser supports the native share sheet */
export function canNativeShare(): boolean {
  return typeof navigator !== 'undefined' && Boolean(navigator.share);
}
