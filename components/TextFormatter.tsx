"use client";

/** 装飾用のネコのみ画像は `public/images/icon.png` を想定しています。 */
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatTextByLength } from "@/lib/formatText";

function parsePositiveInteger(raw: string): { ok: true; value: number } | { ok: false } {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return { ok: false };
  }
  const n = Number(trimmed);
  if (!Number.isInteger(n) || n < 1) {
    return { ok: false };
  }
  return { ok: true, value: n };
}

function IconPencil() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden style={{ flexShrink: 0 }}>
      <path
        fill="currentColor"
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.41l-2.34-2.34a1.003 1.003 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden style={{ flexShrink: 0 }}>
      <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

/** Copy（二枚重ねの書類）— コピーボタン用 */
function IconCopy() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** コピー完了時のチェック（ストローク） */
function IconCopyDone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <polyline
        points="20 6 9 17 4 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const LENGTH_MAX = 9999;

export function TextFormatter() {
  const [lengthInput, setLengthInput] = useState("10");
  const [textInput, setTextInput] = useState("");
  const [toast, setToast] = useState<{
    id: number;
    kind: "success" | "error";
    text: string;
  } | null>(null);
  const [toastLeaving, setToastLeaving] = useState(false);
  const [copyIconDone, setCopyIconDone] = useState(false);
  const copyIconResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lengthParsed = useMemo(() => parsePositiveInteger(lengthInput), [lengthInput]);

  const lengthError =
    lengthInput.trim() === ""
      ? "文字数を入力してください（1 以上の整数）。"
      : !lengthParsed.ok
        ? "1 以上の整数で指定してください。"
        : null;

  const outputText = useMemo(() => {
    if (!lengthParsed.ok) {
      return "";
    }
    try {
      return formatTextByLength(textInput, lengthParsed.value);
    } catch {
      return "";
    }
  }, [lengthParsed, textInput]);

  const showToast = useCallback((text: string, kind: "success" | "error") => {
    setToastLeaving(false);
    setToast({ id: Date.now(), kind, text });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const leave = setTimeout(() => setToastLeaving(true), 2000);
    const remove = setTimeout(() => {
      setToast(null);
      setToastLeaving(false);
    }, 2300);
    return () => {
      clearTimeout(leave);
      clearTimeout(remove);
    };
  }, [toast?.id]);

  useEffect(() => {
    return () => {
      if (copyIconResetRef.current) {
        clearTimeout(copyIconResetRef.current);
      }
    };
  }, []);

  const bumpLength = useCallback((delta: number) => {
    setLengthInput((prev) => {
      const p = parsePositiveInteger(prev);
      const base = p.ok ? p.value : 1;
      const next = Math.max(1, Math.min(LENGTH_MAX, base + delta));
      return String(next);
    });
  }, []);

  const handleCopy = useCallback(async () => {
    if (!lengthParsed.ok) {
      showToast("先に有効な文字数を入力してください。", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(outputText);
      setCopyIconDone(true);
      if (copyIconResetRef.current) {
        clearTimeout(copyIconResetRef.current);
      }
      copyIconResetRef.current = setTimeout(() => {
        setCopyIconDone(false);
        copyIconResetRef.current = null;
      }, 1500);
      showToast("コピーしました", "success");
    } catch {
      showToast("コピーに失敗しました。ブラウザの権限を確認してください。", "error");
    }
  }, [lengthParsed.ok, outputText, showToast]);

  const clearInput = useCallback(() => {
    setTextInput("");
  }, []);

  return (
    <>
    <div className="textkat-page-wrapper">
      <header className="textkat-header">
        <div className="textkat-header-logo-wrap">
          <Image
            src="/images/logo.png"
            alt="TextKat ロゴ"
            width={220}
            height={72}
            priority
            className="textkat-header-logo"
          />
        </div>
        <p className="textkat-header-tagline">
          文字数で折り切り、コピーしてそのまま貼る。改行も保持。
        </p>
      </header>

      <div className="textkat-page-content">
        <section className="textkat-main-card">
          <div className="textkat-length-row textkat-card-top-bar">
            <div className="textkat-length-controls">
              <label
                htmlFor="chunk-length"
                style={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                  aria-hidden
                >
                  <Image
                    src="/images/icon.png"
                    alt=""
                    width={24}
                    height={24}
                    style={{ borderRadius: 8 }}
                  />
                </span>
                折り返し文字数
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <button
                  type="button"
                  onClick={() => bumpLength(-1)}
                  aria-label="折り返し文字数を1減らす"
                  title="1減らす"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    fontSize: "1.25rem",
                    lineHeight: 1,
                    cursor: "pointer",
                    color: "var(--color-text)",
                  }}
                >
                  −
                </button>
                <input
                  id="chunk-length"
                  className="textkat-length-input"
                  type="number"
                  min={1}
                  max={LENGTH_MAX}
                  inputMode="numeric"
                  value={lengthInput}
                  onChange={(e) => setLengthInput(e.target.value)}
                  aria-invalid={lengthError ? "true" : "false"}
                  aria-describedby={lengthError ? "length-error" : undefined}
                  style={{
                    width: 88,
                    padding: "0.55rem 0.5rem",
                    borderRadius: "var(--radius-sm)",
                    border: `2px solid ${lengthError ? "var(--color-error)" : "var(--color-border)"}`,
                    background: lengthError ? "#fff8f8" : "var(--color-surface)",
                    fontSize: "1rem",
                    textAlign: "center",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => bumpLength(1)}
                  aria-label="折り返し文字数を1増やす"
                  title="1増やす"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    fontSize: "1.25rem",
                    lineHeight: 1,
                    cursor: "pointer",
                    color: "var(--color-text)",
                  }}
                >
                  ＋
                </button>
              </div>
              <span style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>文字ごと</span>
            </div>
            <div className="textkat-quick-actions" aria-label="クイック操作">
              <button
                type="button"
                className="textkat-clear-button"
                onClick={clearInput}
                title="入力欄のテキストをすべて削除します"
              >
                <span className="textkat-clear-button-icon" aria-hidden>
                  ×
                </span>
                クリア
              </button>
            </div>
          </div>

          {lengthError && (
            <p id="length-error" className="textkat-length-error" role="alert">
              {lengthError}
            </p>
          )}

          <div className="textkat-label-row textkat-label-row-only">
            <label htmlFor="source-text" className="textkat-editor-heading textkat-input-label">
              <IconPencil />
              入力
            </label>
            <label htmlFor="output-text" className="textkat-editor-heading textkat-result-label">
              <IconCheck />
              整形結果
            </label>
            <button
              type="button"
              className="textkat-copy-button"
              onClick={handleCopy}
              title="整形結果をコピー"
              aria-label="整形結果をコピー"
            >
              {copyIconDone ? <IconCopyDone /> : <IconCopy />}
            </button>
          </div>

          <div className="textkat-panels textkat-textarea-row">
            <div className="textkat-panel">
              <textarea
                id="source-text"
                className="textkat-textarea-field textkat-input-area"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="ここにテキストを入力してください。改行は無視され、指定文字数で再整形されます。"
              />
            </div>

            <div className="textkat-panel">
              <div className="textkat-output-wrap">
                <textarea
                  id="output-text"
                  className="textkat-textarea-field textkat-result-area"
                  readOnly
                  value={outputText}
                  placeholder={
                    lengthError
                      ? "文字数を正しく入力すると、ここに結果が表示されます。"
                      : "整形後のテキストがここに表示されます。"
                  }
                />
              </div>
            </div>
          </div>

          <div className="textkat-hint-box">
            <Image
              src="/images/icon.png"
              alt=""
              width={28}
              height={28}
              className="textkat-hint-icon"
            />
            <span>
              入力内の改行はつなげてから、指定文字数で区切ります。空の入力のときは結果も空です。
            </span>
          </div>
        </section>
      </div>
    </div>

    {toast && (
      <div
        className={`textkat-toast textkat-toast--${toast.kind} ${toastLeaving ? "textkat-toast--leave" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast.text}
      </div>
    )}
    </>
  );
}
