import { IAccount } from "dots-wrapper/dist/account";
import { NextPage } from "next";

export type PropsOf<
  C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = JSX.LibraryManagedAttributes<C, React.ComponentPropsWithoutRef<C>>;

type AsProp<C extends React.ElementType> = {
  /**
   * An override of the default HTML tag.
   * Can also be another React component.
   */
  component?: C;
  children?: React.ReactNode;
};

export type ExtendableProps<
  ExtendedProps = {},
  OverrideProps = {}
> = OverrideProps & Omit<ExtendedProps, keyof OverrideProps>;

export type InheritableElementProps<
  C extends React.ElementType,
  Props = {}
> = ExtendableProps<PropsOf<C>, Props>;

export type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = {}
> = InheritableElementProps<C, Props & AsProp<C>>;

export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

export type GenericSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export type WithToken<T> = T & { token?: string | null };

export type FavoriteType = "apps" | "droplets" | "databases" | "domains";
export type FavoritedResource = {
  id: string | number;
  title?: string;
  type: FavoriteType;
};

export type TokenAccountMap = Record<string, IAccount & { token: string }>;
