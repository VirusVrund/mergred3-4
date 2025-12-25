/**
 * Lightweight logger for authorization events.
 * Replace with production logger (Winston, Pino, etc.) in real deployments.
 */
export class AuthLogger {
    static logDenial(
        endpoint: string,
        reason: string,
        required?: ReadonlyArray<string>,
        userRoles?: ReadonlyArray<string>,
        owner?: string
    ): void {
        const timestamp = new Date().toISOString();
        console.warn('[AUTH_DENIAL]', {
            timestamp,
            endpoint,
            reason,
            requiredRoles: required,
            userRoles,
            owner
        });
    }

    static logSuccess(endpoint: string, owner: string, roles: ReadonlyArray<string>): void {
        const timestamp = new Date().toISOString();
        console.log('[AUTH_SUCCESS]', {
            timestamp,
            endpoint,
            owner,
            roles
        });
    }

    static logError(message: string, error: unknown): void {
        const timestamp = new Date().toISOString();
        console.error('[AUTH_ERROR]', {
            timestamp,
            message,
            error
        });
    }
}
