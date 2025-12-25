/**
 * Standardized error codes for authorization failures.
 */
export enum AuthErrorCode {
    MISSING_AUTH_CONTEXT = 'AUTH_001',
    INVALID_AUTH_CONTEXT = 'AUTH_002',
    INSUFFICIENT_ROLE = 'AUTH_003',
    INSUFFICIENT_PERMISSION = 'AUTH_004',
    OWNER_MISMATCH = 'AUTH_005'
}

/**
 * Structured error response interface.
 */
export interface ErrorResponse {
    error: string;
    message: string;
    code: string;
    timestamp?: string;
}

/**
 * Creates standardized error response objects.
 */
export const createErrorResponse = (
    error: string,
    message: string,
    code: AuthErrorCode
): ErrorResponse => ({
    error,
    message,
    code,
    timestamp: new Date().toISOString()
});

/**
 * Predefined error responses for common authorization failures.
 */
export const AuthErrors = {
    MISSING_AUTH: createErrorResponse(
        'forbidden',
        'Authorization required',
        AuthErrorCode.MISSING_AUTH_CONTEXT
    ),
    INVALID_AUTH: createErrorResponse(
        'forbidden',
        'Invalid authorization context',
        AuthErrorCode.INVALID_AUTH_CONTEXT
    ),
    INSUFFICIENT_ROLE: createErrorResponse(
        'forbidden',
        'Insufficient role',
        AuthErrorCode.INSUFFICIENT_ROLE
    ),
    INSUFFICIENT_PERMISSION: createErrorResponse(
        'forbidden',
        'Insufficient permission',
        AuthErrorCode.INSUFFICIENT_PERMISSION
    ),
    OWNER_MISMATCH: createErrorResponse(
        'forbidden',
        'Resource owner mismatch',
        AuthErrorCode.OWNER_MISMATCH
    )
};
