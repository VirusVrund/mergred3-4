/**
 * Centralized role definitions to prevent typos and simplify refactoring.
 * Use these constants across routes and authorization checks.
 */
export const Roles = {
    ADMIN: 'ADMIN',
    PAYMENTS: 'PAYMENTS',
    REPORTS: 'REPORTS',
    USER_MANAGEMENT: 'USER_MANAGEMENT',
    SUPERUSER: 'SUPERUSER'
} as const;

export type Role = typeof Roles[keyof typeof Roles];

/**
 * Role groups for common access patterns.
 * Allows routes to reference predefined sets instead of listing roles repeatedly.
 */
export const RoleGroups = {
    ADMIN_ACCESS: [Roles.ADMIN, Roles.SUPERUSER],
    PAYMENT_ACCESS: [Roles.PAYMENTS, Roles.ADMIN],
    FULL_ACCESS: [Roles.ADMIN, Roles.SUPERUSER]
} as const;
