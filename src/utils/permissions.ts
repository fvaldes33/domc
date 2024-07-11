export type RoleType = "FREE" | "PURCHASER";

export type Action = "create" | "update" | "read" | "delete";

export type Resource =
  | "account"
  | "app"
  | "droplet"
  | "database"
  | "domain"
  | "project"
  | "billing"
  | "invoice"
  | "team";

export type RolePermissions = {
  [role in RoleType]: Permission[];
};

export type Permission = {
  resource: Resource;
  actions: Action[] | "*";
};

export const permissions: RolePermissions = {
  FREE: [
    { resource: "app", actions: ["read"] },
    { resource: "account", actions: ["read"] },
    { resource: "droplet", actions: ["read"] },
    { resource: "database", actions: ["read"] },
    { resource: "domain", actions: ["read"] },
    { resource: "project", actions: ["read"] },
    { resource: "billing", actions: ["read"] },
    { resource: "invoice", actions: [] },
    { resource: "team", actions: ["read"] },
  ],
  PURCHASER: [
    { resource: "app", actions: "*" },
    { resource: "account", actions: "*" },
    { resource: "droplet", actions: "*" },
    { resource: "database", actions: "*" },
    { resource: "domain", actions: "*" },
    { resource: "project", actions: "*" },
    { resource: "billing", actions: "*" },
    { resource: "invoice", actions: "*" },
    { resource: "team", actions: "*" },
  ],
};

export default function canAccess(
  resource: Resource,
  actions: Action[],
  role: RoleType
) {
  const rolePermissions = permissions[role];
  return (rolePermissions || []).some(
    (permission) =>
      permission.resource === resource &&
      (permission.actions === "*" ||
        permission.actions.some((action) => actions.includes(action)))
  );
}
