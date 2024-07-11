import { useGetPreference, useSetPreference } from "@/hooks/usePreferences";
import { DO_FAVORITES, ENABLE_HAPTIC_FEEDBACK } from "@/utils/const";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { toast } from "react-hot-toast";

type FavoritedResource = {
  id: string | number;
  title?: string;
  type: "apps" | "droplets" | "databases" | "domains";
};

export function FavoriteButton({ resource }: { resource: FavoritedResource }) {
  const { data: favorites } = useGetPreference<FavoritedResource[]>({
    key: DO_FAVORITES,
    defaultValue: [],
  });
  const { data: enabledHapticFeedback } = useGetPreference<boolean>({
    key: ENABLE_HAPTIC_FEEDBACK,
    defaultValue: true,
  });
  const setPreferences = useSetPreference<FavoritedResource[]>();

  const isFavorite = favorites?.find((f) => f.id === resource.id);

  const onClick = async () => {
    if (Capacitor.isNativePlatform() && enabledHapticFeedback) {
      await Haptics.impact({
        style: ImpactStyle.Medium,
      });
    }

    if (isFavorite) {
      setPreferences.mutate({
        key: DO_FAVORITES,
        value: (favorites ?? []).filter((f) => f.id !== resource.id),
      });
      toast.success("Favorite Removed");
    } else {
      setPreferences.mutate({
        key: DO_FAVORITES,
        value: [...(favorites ?? []), resource],
      });
      toast.success("Favorite Added");
    }
  };

  return (
    <button className="px-1 " onClick={onClick}>
      {isFavorite ? (
        <IconStarFilled className="text-ocean-2" />
      ) : (
        <IconStar className="text-ocean-2" />
      )}
    </button>
  );
}
