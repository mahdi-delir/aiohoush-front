import type {
  MeResponse,
} from '@/types/auth'


export function hasPermission(
  currentUser: MeResponse | null | undefined,
  permission: string,
): boolean {
  return (
    currentUser?.permissions.includes(
      permission,
    ) ?? false
  )
}


export function hasAnyPermission(
  currentUser: MeResponse | null | undefined,
  permissions: readonly string[],
): boolean {
  if (!currentUser) {
    return false
  }

  return permissions.some(
    (permission) =>
      currentUser.permissions.includes(
        permission,
      ),
  )
}


export function hasAllPermissions(
  currentUser: MeResponse | null | undefined,
  permissions: readonly string[],
): boolean {
  if (!currentUser) {
    return false
  }

  return permissions.every(
    (permission) =>
      currentUser.permissions.includes(
        permission,
      ),
  )
}


export function isInGroup(
  currentUser: MeResponse | null | undefined,
  group: string,
): boolean {
  return (
    currentUser?.groups.includes(group) ??
    false
  )
}


export function isInAnyGroup(
  currentUser: MeResponse | null | undefined,
  groups: readonly string[],
): boolean {
  if (!currentUser) {
    return false
  }

  return groups.some(
    (group) =>
      currentUser.groups.includes(group),
  )
}