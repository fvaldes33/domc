import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="h-full w-full font-sans">
      <Head />
      <body className="fixed inset-0 w-full h-full max-h-full max-w-full overflow-hidden overscroll-y-none touch-manipulation">
        <Main />
        <NextScript />

        <script
          dangerouslySetInnerHTML={{
            __html: `;
  ((open) => {
    XMLHttpRequest.prototype.open = function (...args) {
      open.call(this, ...args);
      if (args[0] === "GET" && args[1].includes("digitalocean")) {
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
