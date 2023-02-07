import { classNames } from "@/utils/classNames";

export function Header({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full z-10" role="banner">
      {children}
    </div>
  );
}

// export function Toolbar({
//   border = false,
//   position = "top",
//   children,
// }: {
//   border?: boolean;
//   position?: "bottom" | "top";
//   children: React.ReactNode;
// }) {
//   return (
//     <div
//       className={classNames(
//         position === "top" ? "pt-safe" : "pb-safe",
//         border ? (position === "top" ? "border-b" : "border-t") : ""
//       )}
//     >
//       <div
//         className="p-1 w-full min-h-[44px] relative flex flex-row items-center justify-between overflow-hidden z-10"
//         style={{
//           contain: "content",
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }

// export function Title({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="absolute inset-0 text-base font-semibold p-1 text-center">
//       <div className="flex items-center h-full">
//         <div className="w-full whitespace-nowrap text-ellipsis overflow-hidden">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

// interface NavbarProps {
//   title?: React.ReactNode;
//   left?: React.ReactNode;
//   right?: React.ReactNode;
// }

// export function Navbar({ title, left, right }: NavbarProps) {
//   return (
//     <Header>
//       <Toolbar>
//         {left && (
//           <div className="relative z-[99] flex items-center p-1">{left}</div>
//         )}
//         {title && <Title>{title}</Title>}
//         {right && (
//           <div className="relative z-[99] flex items-center p-1">{right}</div>
//         )}
//       </Toolbar>
//     </Header>
//   );
// }
