/**
 * Permission definitions for fine-grained access control.
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
