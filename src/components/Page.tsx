function Page({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-type="domc-page"
      className="absolute inset-0 flex flex-col justify-between overflow-hidden select-none z-10"
      style={{
        contain: "layout size style",
      }}
    >
      {children}
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-type="domc-content"
      className="h-full w-full relative flex-grow flex-shrink basis-0"
      style={{
        contain: "size style",
      }}
    >
      <main className="absolute inset-0 overflow-hidden touch-pan-x touch-pan-y touch-pinch-zoom overflow-y-auto overscroll-y-contain z-0 will-change-scroll">
        {children}
      </main>
    </div>
  );
}

Page.Content = Content;

export { Page };
