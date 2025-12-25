import { Request, Response, NextFunction } from 'express';
import { AuthContext } from '../types/auth';
import { AuthErrors } from '../utils/errors';
import { AuthLogger } from '../utils/logger';
import { getPermissionsForRoles, Permission } from '../constants/permissions';

const FORBIDDEN_STATUS = 403;

/**
 * Type guard to validate auth context structure.
 */
const isValidAuthContext = (auth: unknown): auth is AuthContext => {
    if (!auth || typeof auth !== 'object') return false;
    const candidate = auth as Partial<AuthContext>;
    return Array.isArray(candidate.roles) && candidate.roles.every((r) => typeof r === 'string') && typeof candidate.owner === 'string';
};

/**
 * Check if user has at least one required role (OR logic).
 */
const hasRequiredRole = (userRoles: string[], requiredRoles: ReadonlyArray<string>): boolean => {
    const normalizedUserRoles = new Set(userRoles.map((role) => role.toUpperCase()));
    return requiredRoles.some((role) => normalizedUserRoles.has(role.toUpperCase()));
};

/**
 * Check if user has at least one required permission (OR logic).
 */
const hasRequiredPermission = (userRoles: string[], requiredPermissions: ReadonlyArray<Permission>): boolean => {
    const userPermissions = getPermissionsForRoles(userRoles);
    return requiredPermissions.some((perm) => userPermissions.has(perm));
};

/**
 * Role-based authorization middleware.
 * Validates that the authenticated user has at least one of the required roles.
 * 
 * @param requiredRoles - Array of roles, at least one must match (OR logic)
 * @returns Express middleware function
 * 
 * @example
 * router.post('/payments', authorize([Roles.PAYMENTS, Roles.ADMIN]), controller);
 */
export const authorize = (requiredRoles: ReadonlyArray<string>) => {
    if (!Array.isArray(requiredRoles)) {
        throw new Error('authorize middleware expects an array of required roles');
    }

    return (req: Request, res: Response, next: NextFunction) => {
        const endpoint = `${req.method} ${req.path}`;

        if (!req.auth) {
            AuthLogger.logDenial(endpoint, 'Missing auth context', requiredRoles);
            return res.status(FORBIDDEN_STATUS).json(AuthErrors.MISSING_AUTH);
        }

        if (!isValidAuthContext(req.auth)) {
            AuthLogger.logDenial(endpoint, 'Invalid auth context', requiredRoles, undefined, (req.auth as any)?.owner);
            return res.status(FORBIDDEN_STATUS).json(AuthErrors.INVALID_AUTH);
        }

        // Allow access if no roles required (public route with auth context)
        if (requiredRoles.length === 0) {
            AuthLogger.logSuccess(endpoint, req.auth.owner, req.auth.roles);
            return next();
        }

        const { roles, owner } = req.auth;
        if (!hasRequiredRole(roles, requiredRoles)) {
            AuthLogger.logDenial(endpoint, 'Insufficient role', requiredRoles, roles, owner);
            return res.status(FORBIDDEN_STATUS).json(AuthErrors.INSUFFICIENT_ROLE);
        }

        AuthLogger.logSuccess(endpoint, owner, roles);
        return next();
    };
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
            AuthLogger.logDenial(endpoint, 'Missing auth context (permissions check)', requiredPermissions);
            return res.status(FORBIDDEN_STATUS).json(AuthErrors.MISSING_AUTH);
        }

        if (!isValidAuthContext(req.auth)) {
            AuthLogger.logDenial(endpoint, 'Invalid auth context (permissions check)', requiredPermissions, undefined, (req.auth as any)?.owner);
            return res.status(FORBIDDEN_STATUS).json(AuthErrors.INVALID_AUTH);
        }

        if (requiredPermissions.length === 0) {
            AuthLogger.logSuccess(endpoint, req.auth.owner, req.auth.roles);
            return next();
        }

        const { roles, owner } = req.auth;
        if (!hasRequiredPermission(roles, requiredPermissions)) {
            AuthLogger.logDenial(endpoint, 'Insufficient permission', requiredPermissions, roles, owner);
            return res.status(FORBIDDEN_STATUS).json(AuthErrors.INSUFFICIENT_PERMISSION);
        }

        AuthLogger.logSuccess(endpoint, owner, roles);
        return next();
    };
};

/**
 * Owner-based authorization middleware.
 * Validates that the resource owner matches the authenticated user's owner.
 * Use for multi-tenant scenarios where ownership matters.
 * 
 * @param getResourceOwner - Function to extract owner from request (e.g., from params or body)
 * @returns Express middleware function
 * 
 * @example
 * router.get('/payments/:ownerId', authorizeOwner((req) => req.params.ownerId), controller);
 */
export const authorizeOwner = (getResourceOwner: (req: Request) => string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const endpoint = `${req.method} ${req.path}`;

        if (!req.auth) {
            AuthLogger.logDenial(endpoint, 'Missing auth context (owner check)');
            return res.status(FORBIDDEN_STATUS).json(AuthErrors.MISSING_AUTH);
        }

        if (!isValidAuthContext(req.auth)) {
            AuthLogger.logDenial(endpoint, 'Invalid auth context (owner check)', undefined, undefined, (req.auth as any)?.owner);
            return res.status(FORBIDDEN_STATUS).json(AuthErrors.INVALID_AUTH);
        }

        const resourceOwner = getResourceOwner(req);
        const { owner } = req.auth;

        if (owner !== resourceOwner) {
            AuthLogger.logDenial(endpoint, `Owner mismatch: ${owner} !== ${resourceOwner}`, undefined, req.auth.roles, owner);
            return res.status(FORBIDDEN_STATUS).json(AuthErrors.OWNER_MISMATCH);
        }

        AuthLogger.logSuccess(endpoint, owner, req.auth.roles);
        return next();
    };
};

export default authorize;
