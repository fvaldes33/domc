import {
  useCreateDatabaseClusterDb,
  useCreateDatabaseClusterUser,
} from "@/hooks/useDatabases";
import { useForm, zodResolver } from "@mantine/form";
import { ICreateDatabaseDbApiRequest } from "dots-wrapper/dist/database";
import { z } from "zod";
import { Button } from "./Button";

const DbNewFormSchema = z.object({
  database_cluster_id: z.string().min(1, "Database Cluster ID is required"),
  db_name: z.string().min(1, "DB name is required"),
});

export function DbNewForm({ clusterId }: { clusterId: string }) {
  const createDb = useCreateDatabaseClusterDb();
  const form = useForm<ICreateDatabaseDbApiRequest>({
    validate: zodResolver(DbNewFormSchema),
    initialValues: {
      database_cluster_id: clusterId,
      db_name: "",
    },
  });

  const handleSubmit = (values: ICreateDatabaseDbApiRequest) => {
    createDb.mutate(values, {
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
          DB Name
        </label>
        <input
          type="text"
          className="mt-1 block w-full py-[9px] dark:text-black rounded-md border-gray-300 shadow-sm focus:border-ocean focus:ring-ocean sm:text-sm"
          placeholder="Add new database"
          name="dbname"
          autoCapitalize="off"
          spellCheck={false}
          autoComplete="off"
          required
          {...form.getInputProps("db_name")}
        />
      </div>
      <div className="ml-auto">
        <Button loading={createDb.isLoading}>Save</Button>
      </div>
    </form>
  );
}
