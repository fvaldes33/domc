import { useGetPreference, useSetPreference } from "@/hooks/usePreferences";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconMenu2,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { Navbar } from "konsta/react";
import { useRouter } from "next/router";
import { MenuPanel } from "./MenuPanel";

export function MainNavbar({ title }: { title?: string }) {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const { data: colorScheme } = useGetPreference({
    key: "colorScheme",
    defaultValue: "light",
  });
  const setPreference = useSetPreference();

  const toggleColorScheme = () => {
    const next = colorScheme === "light" ? "dark" : "light";
    setPreference.mutate({
      key: "colorScheme",
      value: next,
    });
  };

  const showBackBtn = router.asPath.split("/").length > 2;

  return (
    <>
      <Navbar
        className="fixed top-0 inset-x-0"
        title={title}
        outline={false}
        left={
          showBackBtn ? (
            <button className="" onClick={() => router.back()}>
              <IconArrowLeft />
            </button>
          ) : (
            <button className="" onClick={open}>
              <IconMenu2 />
            </button>
          )
        }
        right={
          <button className="" onClick={toggleColorScheme}>
            {colorScheme === "light" ? <IconMoon /> : <IconSun />}
          </button>
        }
      />
      <div className="h-11 mt-safe" aria-hidden="true"></div>
      <MenuPanel opened={opened} close={close} />
    </>
  );
}
