/* eslint-disable @next/next/no-img-element */
import { useForm, zodResolver } from "@mantine/form";
import { IconLoader, IconLock } from "@tabler/icons-react";
import { z } from "zod";

import { Page } from "@/components/Page";
import { useSetPreference } from "@/hooks/usePreferences";
import { useBrowser } from "@/hooks/useBrowser";
import { DO_TOKEN_KEY } from "@/utils/const";
import logo from "@/assets/logo.png";
import { Button } from "./Button";

const SetupSchema = z.object({
  token: z
    .string({ required_error: "A token is required to continue" })
    .min(1, "A token is required to continue"),
});

export function SetupScreen() {
  const setPreference = useSetPreference<string>();
  const navigate = useBrowser();

  const { getInputProps, onSubmit, ...form } = useForm({
    validate: zodResolver(SetupSchema),
    initialValues: {
      token: "",
    },
  });

  const handleSubmit = ({ token }: z.infer<typeof SetupSchema>) => {
    setPreference.mutate({
      key: DO_TOKEN_KEY,
      value: token,
    });
  };

  return (
    <Page withSidebar={false}>
      <Page.Content>
        <div className="h-screen w-screen flex items-center justify-center bg-indigo-800 text-white">
          <form
            method="post"
            className="container px-4 max-w-sm flex flex-col items-center justify-center"
            onSubmit={onSubmit(handleSubmit)}
          >
            <div className="flex items-center w-full mb-4">
              <img src={logo.src} alt="" className="h-24 w-24 flex-none" />
              <h1 className="text-2xl font-bold ml-4">
                Mission Control
                <em className="block font-normal">for DigitalOcean</em>
              </h1>
            </div>

            <div className="mb-6">
              <p>
                To get started, get your personal access token from{" "}
                <span
                  className="font-bold underline"
                  onClick={() =>
                    navigate(
                      "https://cloud.digitalocean.com/account/api/tokens"
                    )
                  }
                >
                  here
                </span>
                . If you have not created one, click on &quot;Generate New
                Token&quot;. When copied, paste it below to continue.
              </p>
            </div>

            <div className="w-full mb-4">
              <label className="block font-medium text-indigo-200">Token</label>
              <div className="relative mt-1">
                <span className="absolute h-full w-10 flex items-center justify-center">
                  <IconLock size={16} className="text-indigo-800" />
                </span>
                <input
                  type="text"
                  name="token"
                  className="bg-white h-10 pl-9 rounded-md w-full text-indigo-800"
                  placeholder="dop_v1_e...."
                  {...getInputProps("token")}
                />
              </div>
              {form.errors.token && (
                <span className="italic text-red-300">{form.errors.token}</span>
              )}
            </div>
            <Button variant="light" loading={setPreference.isLoading}>
              <span>Get Started</span>
            </Button>
          </form>
        </div>
      </Page.Content>
    </Page>
  );
}
