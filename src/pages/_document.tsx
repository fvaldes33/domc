import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="overscroll-none">
      <Head />
      <body className="fixed inset-0 overscroll-y-none overflow-hidden">
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `;
  ((open) => {
    XMLHttpRequest.prototype.open = function (...args) {
      open.call(this, ...args);
      if (args[1].includes("digitalocean")) {
        this.setRequestHeader("Content-type", "application/json");
      }
    };
  })(XMLHttpRequest.prototype.open);`,
          }}
        />
      </body>
    </Html>
  );
}
