<?php
declare(strict_types=1);

/**
 * Traventure Modern Standardized API Response Helper
 *
 * Implements a unified JSON response envelope conforming to modern RESTful
 * standards with strict typing, HTTP status code mapping, and RFC-compliant error structures.
 */
class ApiResponse {
    /**
     * Maps HTTP status codes to standard RFC reason phrases using PHP 8 match expression.
     */
    public static function statusText(int $statusCode): string {
        return match ($statusCode) {
            200 => 'OK',
            201 => 'Created',
            202 => 'Accepted',
            204 => 'No Content',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            409 => 'Conflict',
            422 => 'Unprocessable Entity',
            429 => 'Too Many Requests',
            500 => 'Internal Server Error',
            502 => 'Bad Gateway',
            503 => 'Service Unavailable',
            default => 'Unknown Status',
        };
    }

    /**
     * Emits a standardized JSON response and halts execution.
     *
     * @param mixed $data Primary response payload (array, object, scalar, or null)
     * @param int $statusCode HTTP status code (default 200)
     * @param string $message Optional human-readable message
     * @param array<string, string> $headers Additional HTTP response headers
     * @return never
     */
    public static function json(
        mixed $data = null,
        int $statusCode = 200,
        string $message = '',
        array $headers = []
    ): void {
        if (!headers_sent()) {
            http_response_code($statusCode);
            header('Content-Type: application/json; charset=utf-8');
            header('X-Content-Type-Options: nosniff');
            foreach ($headers as $headerKey => $headerValue) {
                header("{$headerKey}: {$headerValue}");
            }
        }

        $isSuccess = ($statusCode >= 200 && $statusCode < 400);

        // If data is an associative array, merge standard envelope fields while preserving existing keys
        // for seamless backward compatibility with existing frontend consumers.
        if (is_array($data) && (array_keys($data) !== range(0, count($data) - 1) || empty($data))) {
            $payload = $data;
            if (!array_key_exists('success', $payload)) {
                $payload['success'] = $isSuccess;
            }
            if ($message !== '' && !array_key_exists('message', $payload)) {
                $payload['message'] = $message;
            }
            if (!array_key_exists('statusCode', $payload)) {
                $payload['statusCode'] = $statusCode;
            }
        } else {
            $payload = [
                'success' => $isSuccess,
                'statusCode' => $statusCode,
                'message' => $message !== '' ? $message : self::statusText($statusCode),
                'data' => $data
            ];
        }

        echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit();
    }

    /**
     * Shortcut for 200 OK success responses.
     */
    public static function ok(mixed $data = null, string $message = 'OK', array $headers = []): void {
        self::json($data, 200, $message, $headers);
    }

    /**
     * Shortcut for 201 Created success responses.
     */
    public static function created(mixed $data = null, string $message = 'Resource created successfully', array $headers = []): void {
        self::json($data, 201, $message, $headers);
    }

    /**
     * Generic error response dispatcher.
     */
    public static function error(string $message, int $statusCode = 400, mixed $errors = null, array $headers = []): void {
        $payload = [
            'success' => false,
            'statusCode' => $statusCode,
            'message' => $message
        ];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        self::json($payload, $statusCode, $message, $headers);
    }

    /**
     * Shortcut for 400 Bad Request error.
     */
    public static function badRequest(string $message = 'Bad Request', mixed $errors = null): void {
        self::error($message, 400, $errors);
    }

    /**
     * Shortcut for 401 Unauthorized error.
     */
    public static function unauthorized(string $message = 'Authentication required to access this resource.'): void {
        self::error($message, 401);
    }

    /**
     * Shortcut for 403 Forbidden error.
     */
    public static function forbidden(string $message = 'Access to this resource is denied.'): void {
        self::error($message, 403);
    }

    /**
     * Shortcut for 404 Not Found error.
     */
    public static function notFound(string $message = 'The requested resource was not found.'): void {
        self::error($message, 404);
    }

    /**
     * Shortcut for 409 Conflict error (e.g. concurrent seat reservations).
     */
    public static function conflict(string $message = 'A state conflict occurred with the requested resource.'): void {
        self::error($message, 409);
    }

    /**
     * Shortcut for 429 Too Many Requests rate-limiting error.
     */
    public static function tooManyRequests(
        string $message = 'Too many requests. Please slow down and try again later.',
        int $retryAfterSeconds = 60
    ): void {
        self::error($message, 429, null, [
            'Retry-After' => (string)$retryAfterSeconds
        ]);
    }

    /**
     * Shortcut for 500 Internal Server Error.
     */
    public static function serverError(string $message = 'An unexpected internal server error occurred.', ?Throwable $exception = null): void {
        $payload = [
            'success' => false,
            'statusCode' => 500,
            'message' => $message
        ];

        // Include sanitized debug info only in local dev environment
        $isDev = (getenv('APP_ENV') === 'development' || (isset($_SERVER['SERVER_NAME']) && in_array($_SERVER['SERVER_NAME'], ['localhost', '127.0.0.1'])));
        if ($isDev && $exception !== null) {
            $payload['debug'] = [
                'exception' => get_class($exception),
                'error' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine()
            ];
        }

        self::json($payload, 500, $message);
    }
}
