import { useGetPreference, useSetPreference } from "@/hooks/usePreferences";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconMenu2,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { useRouter } from "next/router";

import { Navbar } from "@/components/Navbar";
import { MenuPanel } from "@/components/MenuPanel";
import { DO_COLOR_SCHEME, DO_COLOR_SCHEME_PREF } from "@/utils/const";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

export function MainNavbar({ title }: { title?: string }) {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const { data: colorScheme } = useGetPreference({
    key: DO_COLOR_SCHEME,
    defaultValue: "light",
  });
  const { data: colorSchemePref } = useGetPreference({
    key: DO_COLOR_SCHEME_PREF,
    defaultValue: "manual",
  });

  const setPreference = useSetPreference();

  const toggleColorScheme = () => {
    const next = colorScheme === "light" ? "dark" : "light";
    setPreference.mutate({
      key: DO_COLOR_SCHEME,
      value: next,
    });
  };

  const showBackBtn = router.asPath.split("/").length > 2;

  const onClick = (cb: Function) => {
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({
        style: ImpactStyle.Light,
      });
    }
    cb();
  };

  return (
    <>
      <Navbar
        title={title}
        left={
          showBackBtn ? (
            <button className="" onClick={() => onClick(router.back)}>
              <IconArrowLeft />
            </button>
          ) : (
            <button className="lg:hidden" onClick={() => onClick(open)}>
              <IconMenu2 />
            </button>
          )
        }
        right={
          colorSchemePref &&
          colorSchemePref === "manual" && (
            <button className="" onClick={() => onClick(toggleColorScheme)}>
              {colorScheme === "light" ? <IconMoon /> : <IconSun />}
            </button>
          )
        }
      />
      <MenuPanel opened={opened} close={close} />
    </>
  );
}
