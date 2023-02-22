/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/Button";
import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import { useGetPreference } from "@/hooks/usePreferences";
import { DO_FAVORITES } from "@/utils/const";
import Link from "next/link";
import favoritesImage from "@/assets/favorites.png";
import {
  IconApps,
  IconDatabase,
  IconWorld,
  IconDroplet,
  IconStarFilled,
  TablerIconsProps,
} from "@tabler/icons-react";
import { FavoritedResource, FavoriteType } from "@/types";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useMemo } from "react";

const FavoriteIconMap: {
  [k in FavoriteType]: (props: TablerIconsProps) => JSX.Element;
} = {
  apps: IconApps,
  databases: IconDatabase,
  domains: IconWorld,
  droplets: IconDroplet,
};

type GroupedFavorites = {
  [key in FavoriteType]: FavoritedResource[];
};

export default function FavoritesPage() {
  const { data: favorites } = useGetPreference<FavoritedResource[]>({
    key: DO_FAVORITES,
    defaultValue: [],
  });

  const grouped = useMemo(() => {
    if (!favorites) return {} as GroupedFavorites;

    return favorites.reduce((acc, fav) => {
      return {
        ...acc,
        [fav.type]: [...(acc[fav.type] ?? []), fav],
      };
    }, {} as GroupedFavorites);
  }, [favorites]);

  return (
    <Page>
      <MainNavbar />
      <Page.Content>
        {favorites && favorites.length === 0 ? (
          <div className="px-4 flex flex-col items-center justify-center h-96">
            <img src={favoritesImage.src} alt="" className="w-40" />
            <p className="text-2xl font-bold text-center my-4">
              {`Looks like you don't have any favorites`}
            </p>
            <Button component={Link} href="/" className="flex-shrink-0">
              Back
            </Button>
          </div>
        ) : (
          <>
            <div className="px-4 pt-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Favorites</h1>
              </div>
            </div>

            <ul className="">
              {Object.keys(grouped).map((key: string) => {
                const favs = grouped[key as keyof typeof grouped];
                const Icon = FavoriteIconMap[key as keyof typeof grouped];

                return (
                  <li key={key} className="mb-4">
                    <div className="py-2 px-4 sticky top-0 bg-white dark:bg-gray-800 border-b border-ocean-2 z-[1] text-sm font-medium">
                      <div className="flex items-center">
                        <Icon className="mr-2" size={16} />
                        <p className="capitalize">{key}</p>
                      </div>
                    </div>
                    <ul className="pl-4 relative">
                      {favs?.map(({ id, type, title }) => {
                        const Icon = FavoriteIconMap[type];
                        const href = `/${type}/${id}`;
                        return (
                          <li
                            className="relative flex items-center border-b border-ocean-2/25 pr-4 py-2 last:border-0"
                            key={id}
                          >
                            <Link className="w-full" href={href}>
                              <p>{title}</p>
                            </Link>
                            <span className="ml-auto">
                              <FavoriteButton resource={{ id, type, title }} />
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Page.Content>
    </Page>
  );
}
