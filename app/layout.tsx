import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TextKat — 文字数ごとに整形",
  description:
    "テキストを指定した文字数ごとに改行して、そのままコピーできる文字整形ツールです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
