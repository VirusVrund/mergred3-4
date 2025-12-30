/**
 * Lightweight logger for authorization events.
 * Replace with production logger (Winston, Pino, etc.) in real deployments.
 */
export class AuthLogger {
    static logDenial(
        endpoint: string,
        reason: string,
        required?: ReadonlyArray<string>,
        userPermissions?: ReadonlyArray<string>
    ): void {
        const timestamp = new Date().toISOString();
        console.warn('[AUTH_DENIAL]', {
            timestamp,
            endpoint,
            reason,
            requiredPermissions: required,
            userPermissions
        });
    }

    static logSuccess(endpoint: string, permissions: ReadonlyArray<string>): void {
        const timestamp = new Date().toISOString();
        console.log('[AUTH_SUCCESS]', {
            timestamp,
            endpoint,
            permissions
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

