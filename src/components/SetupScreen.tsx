import { useSetPreference } from "@/hooks/usePreferences";
import { useForm, zodResolver } from "@mantine/form";
import { IconLoader, IconLock } from "@tabler/icons-react";
import { Page } from "konsta/react";
import { z } from "zod";

const SetupSchema = z.object({
  token: z.string({ required_error: "A token is required to continue " }),
});

export function SetupScreen() {
  const setPreference = useSetPreference<string>();

  const { getInputProps, onSubmit } = useForm({
    validate: zodResolver(SetupSchema),
    initialValues: {
      token: "",
    },
  });

  const handleSubmit = ({ token }: z.infer<typeof SetupSchema>) => {
    setPreference.mutate({
      key: "token",
      value: token,
    });
  };

  return (
    <Page>
      <div className="h-screen w-screen flex items-center justify-center bg-indigo-800 text-white">
        <form
          method="post"
          className="container px-4 max-w-sm flex flex-col items-center justify-center"
          onSubmit={onSubmit(handleSubmit)}
        >
          <h1 className="text-3xl font-bold text-center mb-6">
            Digital Ocean Mobile
          </h1>
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
          </div>
          <button className="bg-white h-10 px-4 rounded-md flex items-center justify-center text-indigo-800 font-bold">
            {setPreference.isLoading ? (
              <IconLoader size={20} className="animate-spin" />
            ) : (
              <span>Save</span>
            )}
          </button>
        </form>
      </div>
    </Page>
  );
}
