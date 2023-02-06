import { useQuery } from "@tanstack/react-query";
import { createApiClient } from "dots-wrapper";
import { IProject, IProjectResource } from "dots-wrapper/dist/project";
import { IListRequest } from "dots-wrapper/dist/types";
import { useGetPreference } from "./usePreferences";

export type IEnhancedProject = IProject & { resources: IProjectResource[] };

async function getProjects({
  token,
  ...input
}: IListRequest & { token?: string | null }) {
  if (!token) throw new Error("Token is required");

  const dots = createApiClient({ token });
  const {
    data: { projects },
  } = await dots.project.listProjects(input);

  const enhancedProjects: IEnhancedProject[] = [];
  for (const project of projects) {
    const {
      data: { resources },
    } = await dots.project.listProjectResources({ project_id: project.id });
    enhancedProjects.push({
      ...project,
      resources,
    });
  }

  return enhancedProjects;
}

export function useGetProjects({ page, per_page }: IListRequest) {
  const { data: token } = useGetPreference<string | null>({
    key: "token",
  });
  return useQuery({
    queryKey: ["projects", page, per_page],
    queryFn: () =>
      getProjects({
        token,
        page,
        per_page,
      }),
  });
}
