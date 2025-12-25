import { getPermissionsForRoles, Permissions, RolePermissions } from '../src/constants/permissions';
import { Roles } from '../src/constants/roles';

describe('Permissions system', () => {
    describe('getPermissionsForRoles', () => {
        it('returns correct permissions for PAYMENTS role', () => {
            const permissions = getPermissionsForRoles([Roles.PAYMENTS]);

            expect(permissions.has(Permissions.PAYMENTS_CREATE)).toBe(true);
            expect(permissions.has(Permissions.PAYMENTS_READ)).toBe(true);
            expect(permissions.has(Permissions.PAYMENTS_UPDATE)).toBe(true);
            expect(permissions.has(Permissions.PAYMENTS_DELETE)).toBe(false);
        });

        it('returns correct permissions for ADMIN role', () => {
            const permissions = getPermissionsForRoles([Roles.ADMIN]);

            expect(permissions.has(Permissions.PAYMENTS_CREATE)).toBe(true);
            expect(permissions.has(Permissions.PAYMENTS_DELETE)).toBe(true);
            expect(permissions.has(Permissions.USERS_MANAGE)).toBe(true);
            expect(permissions.has(Permissions.REPORTS_VIEW)).toBe(true);
        });

        it('returns all permissions for SUPERUSER role', () => {
            const permissions = getPermissionsForRoles([Roles.SUPERUSER]);

            expect(permissions.size).toBe(Object.keys(Permissions).length);
            expect(permissions.has(Permissions.PAYMENTS_DELETE)).toBe(true);
            expect(permissions.has(Permissions.USERS_MANAGE)).toBe(true);
        });

        it('merges permissions from multiple roles', () => {
            const permissions = getPermissionsForRoles([Roles.PAYMENTS, Roles.REPORTS]);

            expect(permissions.has(Permissions.PAYMENTS_CREATE)).toBe(true);
            expect(permissions.has(Permissions.REPORTS_VIEW)).toBe(true);
            expect(permissions.has(Permissions.USERS_MANAGE)).toBe(false);
        });

        it('handles empty roles array', () => {
            const permissions = getPermissionsForRoles([]);

            expect(permissions.size).toBe(0);
        });

        it('handles unknown roles gracefully', () => {
            const permissions = getPermissionsForRoles(['UNKNOWN_ROLE']);

            expect(permissions.size).toBe(0);
        });

        it('is case-insensitive for role names', () => {
            const permissions = getPermissionsForRoles(['payments']);

            expect(permissions.has(Permissions.PAYMENTS_CREATE)).toBe(true);
        });
    });

    describe('RolePermissions mapping', () => {
        it('has defined permissions for all standard roles', () => {
            expect(RolePermissions[Roles.PAYMENTS]).toBeDefined();
            expect(RolePermissions[Roles.ADMIN]).toBeDefined();
            expect(RolePermissions[Roles.SUPERUSER]).toBeDefined();
            expect(RolePermissions[Roles.REPORTS]).toBeDefined();
            expect(RolePermissions[Roles.USER_MANAGEMENT]).toBeDefined();
        });

        it('SUPERUSER has all permissions', () => {
            const superuserPerms = RolePermissions[Roles.SUPERUSER];
            const allPerms = Object.values(Permissions);

            expect(superuserPerms.length).toBe(allPerms.length);
        });
    });
});
