export function splitChatMessagePreview(
  text: string,
  maxPreviewLength = 500,
): { preview: string; remainder: string | null } {
  if (text.length <= maxPreviewLength)
    return { preview: text, remainder: null };

  const limit = Math.max(1, Math.floor(maxPreviewLength));
  const paragraphBreak = text.lastIndexOf("\n\n", limit);
  let splitAt = limit;
  if (paragraphBreak > limit / 2) {
    splitAt = paragraphBreak;
  } else {
    for (let index = limit; index > 0; index--) {
      if (/\s/u.test(text[index] ?? "")) {
        splitAt = index;
        break;
      }
    }
  }

  if (typeof Intl.Segmenter === "function") {
    const segments = new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    }).segment(text);
    for (const { index, segment } of segments) {
      if (index + segment.length > splitAt) {
        splitAt = index || segment.length;
        break;
      }
    }
  } else if (/^[\uDC00-\uDFFF]$/u.test(text[splitAt] ?? "")) {
    splitAt = splitAt === 1 ? 2 : splitAt - 1;
  }

  return {
    preview: text.slice(0, splitAt).trimEnd(),
    remainder: text.slice(splitAt).trimStart() || null,
  };
}
