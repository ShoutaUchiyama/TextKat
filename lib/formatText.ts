/**
 * 入力から改行を除去し、指定文字数ごとに分割して \\n で結合して返す。
 * 文字数は JavaScript の文字列インデックスに基づく単純なカウント。
 */
export function formatTextByLength(text: string, length: number): string {
  if (!Number.isInteger(length) || length < 1) {
    throw new Error("length は 1 以上の整数である必要があります");
  }

  const normalized = text.replace(/\r\n|\r|\n/g, "");
  if (normalized.length === 0) {
    return "";
  }

  const chunks: string[] = [];
  for (let i = 0; i < normalized.length; i += length) {
    chunks.push(normalized.slice(i, i + length));
  }
  return chunks.join("\n");
}
