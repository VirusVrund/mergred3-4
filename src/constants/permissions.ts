/**
 * Permission definitions for fine-grained access control.
 * As the system grows, map roles to permissions for better scalability.
 */
export const Permissions = {
    PAYMENTS_CREATE: 'payments:create',
    PAYMENTS_READ: 'payments:read',
    PAYMENTS_UPDATE: 'payments:update',
    PAYMENTS_DELETE: 'payments:delete',
    REPORTS_VIEW: 'reports:view',
    REPORTS_EXPORT: 'reports:export',
    USERS_MANAGE: 'users:manage'
} as const;

export type Permission = typeof Permissions[keyof typeof Permissions];

/**
 * Role-to-permission mapping.
 * Centralizes authorization logic and enables permission-based checks.
 */
export const RolePermissions: Record<string, Permission[]> = {
    PAYMENTS: [
        Permissions.PAYMENTS_CREATE,
        Permissions.PAYMENTS_READ,
        Permissions.PAYMENTS_UPDATE
    ],
    ADMIN: [
        Permissions.PAYMENTS_CREATE,
        Permissions.PAYMENTS_READ,
        Permissions.PAYMENTS_UPDATE,
        Permissions.PAYMENTS_DELETE,
        Permissions.REPORTS_VIEW,
        Permissions.REPORTS_EXPORT,
        Permissions.USERS_MANAGE
    ],
    SUPERUSER: Object.values(Permissions),
    REPORTS: [
        Permissions.REPORTS_VIEW,
        Permissions.REPORTS_EXPORT
    ],
    USER_MANAGEMENT: [
        Permissions.USERS_MANAGE
    ]
};

/**
 * Get all permissions for given roles.
 */
export const getPermissionsForRoles = (roles: string[]): Set<Permission> => {
    const permissions = new Set<Permission>();
    roles.forEach((role) => {
        const rolePerms = RolePermissions[role.toUpperCase()];
        if (rolePerms) {
            rolePerms.forEach((perm) => permissions.add(perm));
        }
    });
    return permissions;
};
