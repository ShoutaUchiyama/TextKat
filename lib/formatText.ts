/**
 * 空行（改行が2つ以上連続）で段落に分け、各段落では改行をつなげたうえで
 * 指定文字数ごとに分割して \\n で結合する。段落どうしは入力の空行を詰め、
 * \\n 1 つだけでつなぐ（結果に空行は入れない）。
 * 文字数は JavaScript の文字列インデックスに基づく単純なカウント。
 */
function formatParagraphContent(text: string, length: number): string {
  const merged = text.replace(/\r\n|\r|\n/g, "");
  if (merged.length === 0) {
    return "";
  }

  const chunks: string[] = [];
  for (let i = 0; i < merged.length; i += length) {
    chunks.push(merged.slice(i, i + length));
  }
  return chunks.join("\n");
}

export function formatTextByLength(text: string, length: number): string {
  if (!Number.isInteger(length) || length < 1) {
    throw new Error("length は 1 以上の整数である必要があります");
  }

  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const paragraphs = normalized.split(/\n\n+/);

  const formatted = paragraphs
    .map((p) => formatParagraphContent(p, length))
    .filter((out) => out.length > 0);

  if (formatted.length === 0) {
    return "";
  }
  return formatted.join("\n");
}
