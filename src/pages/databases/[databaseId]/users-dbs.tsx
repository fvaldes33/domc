import { ActionSheet } from "@/components/ActionSheet";
import { ClusterHero } from "@/components/ClusterHero";
import { DbNewForm } from "@/components/DbNewForm";
import { DbUserForm } from "@/components/DbUserForm";
import { MainNavbar } from "@/components/MainNavbar";
import { Page } from "@/components/Page";
import {
  useListDatabaseClusterUsers,
  useListDatabaseClusterDbs,
  useDatabaseCluster,
  useRemoveDatabaseClusterUser,
  useDeleteDatabaseClusterDb,
  useResetDatabaseClusterUser,
} from "@/hooks/useDatabases";
import { useDisclosure, useClipboard } from "@mantine/hooks";
import {
  IconEyeOff,
  IconEye,
  IconUser,
  IconFileDatabase,
  IconCopy,
  IconTrash,
  IconZoomReset,
  IconRefresh,
} from "@tabler/icons-react";
import {
  IDatabaseClusterDb,
  IDatabaseClusterUser,
} from "dots-wrapper/dist/database";
import { motion, useMotionValue } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ClusterUsersDbs() {
  const { query } = useRouter();

  const {
    data: cluster,
    isLoading,
    refetch,
  } = useDatabaseCluster({
    database_cluster_id: query.databaseId as string,
  });

  const { data: dbUsers, refetch: userRefetch } = useListDatabaseClusterUsers({
    page: 1,
    per_page: 100,
    database_cluster_id: query.databaseId as string,
  });

  const { data: dbs, refetch: dbRefetch } = useListDatabaseClusterDbs({
    page: 1,
    per_page: 100,
    database_cluster_id: query.databaseId as string,
  });

  return (
    <Page>
      <MainNavbar />
      <Page.Content
        onRefresh={async (complete) => {
          await Promise.all([userRefetch, dbRefetch]);
          complete();
        }}
      >
        <ClusterHero cluster={cluster} />
        <section className="mt-4">
          <div className="mb-6">
            <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-600 flex items-center px-4">
              <IconUser className="" size={20} strokeWidth={1.5} />
              <span className="ml-2 uppercase">Users</span>
            </p>
            <ul className="">
              {cluster &&
                dbUsers?.map((user) => {
                  return (
                    <li key={user.name} className="">
                      <DbUserItem clusterId={cluster.id} user={user} />
                    </li>
                  );
                })}
            </ul>

            {cluster && <DbUserForm clusterId={cluster.id} />}
          </div>
        </section>
        <section className="mt-4">
          <div className="mb-6">
            <p className="text-sm text-ocean dark:text-blue-400 font-medium py-2 border-b dark:border-gray-600 flex items-center px-4">
              <IconFileDatabase className="" size={20} strokeWidth={1.5} />
              <span className="ml-2 uppercase">Databases</span>
            </p>
            <ul className="">
              {cluster &&
                dbs?.map((db) => {
                  return (
                    <li key={db.name} className="">
                      <DbItem clusterId={cluster.id} db={db} />
                    </li>
                  );
                })}
            </ul>
            {cluster && cluster.engine !== "redis" && (
              <DbNewForm clusterId={cluster.id} />
            )}
          </div>
        </section>
      </Page.Content>
    </Page>
  );
}

function DbUserItem({
  clusterId,
  user,
}: {
  clusterId: string;
  user: IDatabaseClusterUser;
}) {
  const [show, { toggle, close }] = useDisclosure(false);
  const { copy } = useClipboard();

  const x = useMotionValue(0);
  const [left, setLeft] = useState(0);
  const [confirm, showConfirm] = useState(false);
  const [reset, showReset] = useState(false);
  const removeDbUser = useRemoveDatabaseClusterUser();
  const resetDbUser = useResetDatabaseClusterUser();

  return (
    <div className="relative">
      <motion.div
        className="bg-white dark:bg-gray-800 flex justify-between items-center px-4 py-2 relative z-10 h-14"
        drag="x"
        dragConstraints={{ left, right: 0 }}
        style={{
          x,
        }}
        onDragEnd={(_, info) => {
          if (info.offset.x <= -180 || Math.abs(info.velocity.x) >= 100) {
            setLeft(-112);
          } else {
            setLeft(0);
          }
        }}
      >
        <div className="text-sm">
          <p>username: {user.name}</p>
          <p
            className="text-gray-600 dark:text-white text-sm"
            onClick={() => {
              copy(user.password);
              toast.success("Password copied");
            }}
          >
            password: {show ? user.password : "********"}
          </p>
        </div>
        <div className="flex items-center">
          <button
            className="ml-2 h-6 w-6 rounded-md flex items-center justify-center border border-ocean-2"
            onClick={toggle}
          >
            {show ? <IconEyeOff size={12} /> : <IconEye size={12} />}
          </button>
        </div>
      </motion.div>
      <div className="absolute flex items-center top-px bottom-px right-0">
        <button
          onClick={() => showReset(true)}
          className="h-full aspect-square bg-green-400/50 flex items-center justify-center text-white"
        >
          <IconRefresh />
        </button>
        <button
          onClick={() => showConfirm(true)}
          className="h-full aspect-square bg-red-600/50 flex items-center justify-center text-white"
        >
          <IconTrash />
        </button>
      </div>

      <ActionSheet show={confirm} onClose={() => showConfirm(false)}>
        <ActionSheet.Label>Confirm Delete User</ActionSheet.Label>
        <ActionSheet.Button
          onClick={() => {
            removeDbUser.mutate(
              {
                database_cluster_id: clusterId,
                user_name: user.name,
              },
              {
                onSuccess: () => {
                  showConfirm(false);
                },
              }
            );
          }}
        >
          {removeDbUser.isLoading ? "Deleting User..." : "Confirm"}
        </ActionSheet.Button>
        <ActionSheet.Button border={false} className="text-red-600">
          Cancel
        </ActionSheet.Button>
      </ActionSheet>

      <ActionSheet show={reset} onClose={() => showReset(false)}>
        <ActionSheet.Label>Confirm Reset Password</ActionSheet.Label>
        <ActionSheet.Button
          onClick={() => {
            resetDbUser.mutate(
              {
                database_cluster_id: clusterId,
                user_name: user.name,
              },
              {
                onSuccess: () => {
                  showReset(false);
                  setLeft(0);
                  close();
                },
              }
            );
          }}
        >
          {resetDbUser.isLoading ? "Resetting Password..." : "Confirm"}
        </ActionSheet.Button>
        <ActionSheet.Button border={false} className="text-red-600">
          Cancel
        </ActionSheet.Button>
      </ActionSheet>
    </div>
  );
}

function DbItem({
  clusterId,
  db,
}: {
  db: IDatabaseClusterDb;
  clusterId: string;
}) {
  const { copy } = useClipboard();
  const x = useMotionValue(0);
  const [left, setLeft] = useState(0);
  const [confirm, showConfirm] = useState(false);
  const removeDb = useDeleteDatabaseClusterDb();

  return (
    <div className="relative">
      <motion.div
        className="bg-white dark:bg-gray-800 flex justify-between items-center px-4 py-2 relative z-10 h-14"
        drag="x"
        dragConstraints={{ left, right: 0 }}
        style={{
          x,
        }}
        onDragEnd={(_, info) => {
          if (info.offset.x <= -180 || Math.abs(info.velocity.x) >= 100) {
            setLeft(-56);
          } else {
            setLeft(0);
          }
        }}
      >
        <div className="text-sm">
          <p>{db.name}</p>
        </div>
        <div className="flex items-center">
          <button
            className="ml-2 h-6 w-6 rounded-md flex items-center justify-center border border-ocean-2"
            onClick={() => {
              copy(db.name);
              toast.success("DB name copied");
            }}
          >
            <IconCopy size={12} />
          </button>
        </div>
      </motion.div>
      <div className="absolute flex items-center top-px bottom-px right-0">
        <button
          onClick={() => showConfirm(true)}
          className="h-full aspect-square bg-red-600/50 flex items-center justify-center text-white"
        >
          <IconTrash />
        </button>
      </div>

      <ActionSheet show={confirm} onClose={() => showConfirm(false)}>
        <ActionSheet.Label>Confirm Delete Db</ActionSheet.Label>
        <ActionSheet.Button
          onClick={() => {
            removeDb.mutate(
              {
                database_cluster_id: clusterId,
                db_name: db.name,
              },
              {
                onSuccess: () => {
                  showConfirm(false);
                },
              }
            );
          }}
        >
          {removeDb.isLoading ? "Deleting Db..." : "Confirm"}
        </ActionSheet.Button>
        <ActionSheet.Button border={false} className="text-red-600">
          Cancel
        </ActionSheet.Button>
      </ActionSheet>
    </div>
  );
}
