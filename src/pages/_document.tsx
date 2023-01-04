import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-white p-8 text-gray-700 dark:bg-black dark:text-gray-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
