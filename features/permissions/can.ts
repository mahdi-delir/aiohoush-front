import type { Permission } from "./permissions";

export function can(
  permissions: string[],
  permission: Permission,
) {
  return permissions.includes(permission);
}