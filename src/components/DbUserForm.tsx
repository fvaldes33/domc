import { useCreateDatabaseClusterUser } from "@/hooks/useDatabases";
import { useForm, zodResolver } from "@mantine/form";
import { ICreateDatabaseClusterUserApiRequest } from "dots-wrapper/dist/database";
import { z } from "zod";
import { Button } from "./Button";

const DbUserFormSchema = z.object({
  database_cluster_id: z.string().min(1, "Database Cluster ID is required"),
  user_name: z.string().min(1, "Username is required"),
});

export function DbUserForm({ clusterId }: { clusterId: string }) {
  const createDbUser = useCreateDatabaseClusterUser();
  const form = useForm<ICreateDatabaseClusterUserApiRequest>({
    validate: zodResolver(DbUserFormSchema),
    initialValues: {
      database_cluster_id: clusterId,
      user_name: "",
    },
  });

  const handleSubmit = (values: ICreateDatabaseClusterUserApiRequest) => {
    createDbUser.mutate(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      className="mt-2 px-4 flex items-end"
    >
      <div className="flex-1 mr-2">
        <label className="block text-sm font-medium text-black dark:text-white">
          User Name
        </label>
        <input
          type="text"
          className="mt-1 block w-full py-[9px] dark:text-black rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean sm:text-sm"
          placeholder="Add new user"
          name="username"
          required
          autoCapitalize="off"
          spellCheck={false}
          autoComplete="off"
          {...form.getInputProps("user_name")}
        />
      </div>
      <div className="ml-auto">
        <Button loading={createDbUser.isLoading}>Save</Button>
      </div>
    </form>
  );
}
