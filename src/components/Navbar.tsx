import { Header } from "./Header";
import { TitleProps, Toolbar } from "./Toolbar";

interface NavbarProps {
  title?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  titleProps?: TitleProps;
}

export function Navbar({ title, left, right, titleProps }: NavbarProps) {
  return (
    <Header>
      <Toolbar>
        {left && (
          <div className="relative z-[99] flex items-center p-1">{left}</div>
        )}
        {title && <Toolbar.Title {...titleProps}>{title}</Toolbar.Title>}
        {right && (
          <div className="ml-auto relative z-[99] flex items-center p-1">
            {right}
          </div>
        )}
      </Toolbar>
    </Header>
  );
}
