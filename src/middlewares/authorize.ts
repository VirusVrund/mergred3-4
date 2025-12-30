import { Request, Response, NextFunction } from 'express';
import { AuthContext } from '../types/auth';
import { AuthErrors } from '../utils/errors';
import { AuthLogger } from '../utils/logger';
import { Permission } from '../constants/permissions';

const FORBIDDEN_STATUS = 403;

/**
 * Type guard to validate auth context structure.
 */
const isValidAuthContext = (auth: unknown): auth is AuthContext => {
    if (!auth || typeof auth !== 'object') return false;
    const candidate = auth as Partial<AuthContext>;
    return Array.isArray(candidate.permissions) && candidate.permissions.every((p) => typeof p === 'string');
};

/**
 * Check if user has at least one required permission (OR logic).
 */
const hasRequiredPermission = (userPermissions: string[], requiredPermissions: ReadonlyArray<Permission>): boolean => {
    const userPermsSet = new Set(userPermissions);
    return requiredPermissions.some((perm) => userPermsSet.has(perm));
};

/**
 * Permission-based authorization middleware.
 * Validates that the authenticated user has at least one of the required permissions.
 * 
 * @param requiredPermissions - Array of permissions, at least one must match (OR logic)
 * @returns Express middleware function
 * 
 * @example
 * router.post('/payments', authorizePermissions([Permissions.PAYMENTS_CREATE]), controller);
 */
export const authorizePermissions = (requiredPermissions: ReadonlyArray<Permission>) => {
    if (!Array.isArray(requiredPermissions)) {
        throw new Error('authorizePermissions middleware expects an array of required permissions');
    }

    return (req: Request, res: Response, next: NextFunction) => {
        const endpoint = `${req.method} ${req.path}`;

        if (!req.auth) {
            AuthLogger.logDenial(endpoint, 'Missing auth context', requiredPermissions);
            return res.status(FORBIDDEN_STATUS).json(AuthErrors.MISSING_AUTH);
        }

        if (!isValidAuthContext(req.auth)) {
            AuthLogger.logDenial(endpoint, 'Invalid auth context', requiredPermissions);
            return res.status(FORBIDDEN_STATUS).json(AuthErrors.INVALID_AUTH);
        }

        if (requiredPermissions.length === 0) {
            AuthLogger.logSuccess(endpoint, req.auth.permissions);
            return next();
        }

        const { permissions } = req.auth;
        if (!hasRequiredPermission(permissions, requiredPermissions)) {
            AuthLogger.logDenial(endpoint, 'Insufficient permission', requiredPermissions, permissions);
            return res.status(FORBIDDEN_STATUS).json(AuthErrors.INSUFFICIENT_PERMISSION);
        }

        AuthLogger.logSuccess(endpoint, permissions);
        return next();
    };
};

export default authorizePermissions;
