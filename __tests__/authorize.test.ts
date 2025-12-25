import { authorize, authorizePermissions, authorizeOwner } from '../src/middlewares/authorize';
import { Request, Response, NextFunction } from 'express';
import { Roles } from '../src/constants/roles';
import { Permissions } from '../src/constants/permissions';
import { AuthErrorCode } from '../src/utils/errors';

interface MockResponse {
    status: jest.Mock;
    json: jest.Mock;
}

const createMockRes = (): Response & MockResponse => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    } as unknown as Response & MockResponse;
    return res;
};

const createMockReq = (overrides?: Partial<Request>): Request => {
    return {
        method: 'POST',
        path: '/api/test',
        ...overrides
    } as Request;
};

describe('authorize middleware (role-based)', () => {
    const next: NextFunction = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 403 with AUTH_001 when auth context is missing', () => {
        const req = createMockReq();
        const res = createMockRes();

        authorize([Roles.PAYMENTS])(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: 'forbidden',
                message: 'Authorization required',
                code: AuthErrorCode.MISSING_AUTH_CONTEXT
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 403 with AUTH_002 when auth context is invalid', () => {
        const req = createMockReq({ auth: { roles: 'invalid' } as any });
        const res = createMockRes();

        authorize([Roles.PAYMENTS])(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: 'forbidden',
                message: 'Invalid authorization context',
                code: AuthErrorCode.INVALID_AUTH_CONTEXT
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 403 with AUTH_003 when roles are missing required entries', () => {
        const req = createMockReq({ auth: { roles: [Roles.PAYMENTS], owner: 'payment-service' } });
        const res = createMockRes();

        authorize([Roles.ADMIN])(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: 'forbidden',
                message: 'Insufficient role',
                code: AuthErrorCode.INSUFFICIENT_ROLE
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next when a required role is present (OR logic)', () => {
        const req = createMockReq({ auth: { roles: [Roles.PAYMENTS], owner: 'payment-service' } });
        const res = createMockRes();

        authorize([Roles.ADMIN, Roles.PAYMENTS])(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('handles case-insensitive role matching', () => {
        const req = createMockReq({ auth: { roles: ['payments'], owner: 'payment-service' } });
        const res = createMockRes();

        authorize([Roles.PAYMENTS])(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it('allows access when no roles required (public with auth)', () => {
        const req = createMockReq({ auth: { roles: [Roles.PAYMENTS], owner: 'payment-service' } });
        const res = createMockRes();

        authorize([])(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it('throws error when requiredRoles is not an array', () => {
        expect(() => authorize('PAYMENTS' as any)).toThrow('authorize middleware expects an array of required roles');
    });
});

describe('authorizePermissions middleware', () => {
    const next: NextFunction = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 403 when auth context is missing', () => {
        const req = createMockReq();
        const res = createMockRes();

        authorizePermissions([Permissions.PAYMENTS_CREATE])(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                code: AuthErrorCode.MISSING_AUTH_CONTEXT
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 403 when user lacks required permission', () => {
        const req = createMockReq({ auth: { roles: [Roles.REPORTS], owner: 'test-owner' } });
        const res = createMockRes();

        authorizePermissions([Permissions.PAYMENTS_CREATE])(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                code: AuthErrorCode.INSUFFICIENT_PERMISSION
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next when user has required permission', () => {
        const req = createMockReq({ auth: { roles: [Roles.PAYMENTS], owner: 'test-owner' } });
        const res = createMockRes();

        authorizePermissions([Permissions.PAYMENTS_CREATE])(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it('calls next when admin has all permissions', () => {
        const req = createMockReq({ auth: { roles: [Roles.ADMIN], owner: 'test-owner' } });
        const res = createMockRes();

        authorizePermissions([Permissions.PAYMENTS_CREATE])(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    it('throws error when requiredPermissions is not an array', () => {
        expect(() => authorizePermissions('payments:create' as any)).toThrow('authorizePermissions middleware expects an array of required permissions');
    });
});

describe('authorizeOwner middleware', () => {
    const next: NextFunction = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 403 when auth context is missing', () => {
        const req = createMockReq({ params: { ownerId: 'test-owner' } });
        const res = createMockRes();

        authorizeOwner((req) => req.params.ownerId)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                code: AuthErrorCode.MISSING_AUTH_CONTEXT
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 403 when owner does not match', () => {
        const req = createMockReq({
            auth: { roles: [Roles.PAYMENTS], owner: 'owner-a' },
            params: { ownerId: 'owner-b' }
        });
        const res = createMockRes();

        authorizeOwner((req) => req.params.ownerId)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                code: AuthErrorCode.OWNER_MISMATCH
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next when owner matches', () => {
        const req = createMockReq({
            auth: { roles: [Roles.PAYMENTS], owner: 'owner-a' },
            params: { ownerId: 'owner-a' }
        });
        const res = createMockRes();

        authorizeOwner((req) => req.params.ownerId)(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });
});
