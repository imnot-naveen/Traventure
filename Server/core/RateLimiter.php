<?php
declare(strict_types=1);

/**
 * Traventure High-Performance IP Token-Bucket Rate Limiter
 *
 * Implements a high-throughput, atomic token-bucket rate limiter defending API endpoints
 * against high-frequency scraping, credential stuffing, and denial-of-service attempts.
 * Emits standard RFC-compliant rate limit headers (X-RateLimit-*, Retry-After).
 */
class RateLimiter {
    private string $storageDir;

    /**
     * Constructor initializes the storage directory with atomic file locking support.
     */
    public function __construct(?string $storageDir = null) {
        $this->storageDir = $storageDir ?? (sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'traventure_rate_limits');
        if (!is_dir($this->storageDir)) {
            @mkdir($this->storageDir, 0775, true);
        }
    }

    /**
     * Resolves the most accurate client IP address across reverse proxies and CDNs.
     */
    public static function resolveClientIp(): string {
        $headers = [
            'HTTP_CF_CONNECTING_IP',     // Cloudflare
            'HTTP_X_REAL_IP',            // Nginx reverse proxy
            'HTTP_X_FORWARDED_FOR',      // Standard multi-proxy header
            'HTTP_CLIENT_IP',
            'REMOTE_ADDR'
        ];

        foreach ($headers as $header) {
            if (!empty($_SERVER[$header])) {
                $ips = explode(',', (string)$_SERVER[$header]);
                $cleanIp = trim($ips[0]);
                if (filter_var($cleanIp, FILTER_VALIDATE_IP)) {
                    return $cleanIp;
                }
            }
        }

        return '127.0.0.1';
    }

    /**
     * Evaluates a rate limit bucket using an atomic Token-Bucket algorithm.
     *
     * @param string $identifier Unique client identifier (e.g. "search:203.0.113.19")
     * @param int $limit Maximum burst capacity (number of tokens)
     * @param int $decaySeconds Window in seconds over which the full capacity replenishes
     * @param int $cost Tokens deducted per request
     * @return array{allowed: bool, limit: int, remaining: int, reset: int, retryAfter: int, identifier: string}
     */
    public function check(string $identifier, int $limit = 60, int $decaySeconds = 60, int $cost = 1): array {
        $hashKey = hash('sha256', $identifier);
        $filePath = $this->storageDir . DIRECTORY_SEPARATOR . $hashKey . '.lock';

        $now = microtime(true);
        $refillRate = $limit / max(1, $decaySeconds); // Tokens per second

        $fp = @fopen($filePath, 'c+');
        if (!$fp) {
            // Fallback if filesystem write is temporarily unavailable
            return [
                'allowed' => true,
                'limit' => $limit,
                'remaining' => $limit - $cost,
                'reset' => (int)ceil($now + $decaySeconds),
                'retryAfter' => 0,
                'identifier' => $identifier
            ];
        }

        // Acquire exclusive lock to prevent concurrent token race conditions
        flock($fp, LOCK_EX);

        rewind($fp);
        $rawContent = stream_get_contents($fp);
        $state = json_decode($rawContent ?: '', true);

        if (!is_array($state) || !isset($state['tokens'], $state['last_updated'])) {
            $state = [
                'tokens' => (float)$limit,
                'last_updated' => $now
            ];
        }

        // Calculate token replenishment over elapsed time
        $elapsed = max(0.0, $now - (float)$state['last_updated']);
        $currentTokens = min((float)$limit, (float)$state['tokens'] + ($elapsed * $refillRate));

        if ($currentTokens >= $cost) {
            $allowed = true;
            $currentTokens -= $cost;
            $retryAfter = 0;
        } else {
            $allowed = false;
            $missing = $cost - $currentTokens;
            $retryAfter = (int)ceil($missing / $refillRate);
        }

        $remaining = max(0, (int)floor($currentTokens));
        $timeToFull = ($limit - $currentTokens) / $refillRate;
        $resetTime = (int)ceil($now + $timeToFull);

        // Save updated bucket state atomically
        $state['tokens'] = $currentTokens;
        $state['last_updated'] = $now;

        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($state));
        fflush($fp);

        flock($fp, LOCK_UN);
        fclose($fp);

        return [
            'allowed' => $allowed,
            'limit' => $limit,
            'remaining' => $remaining,
            'reset' => $resetTime,
            'retryAfter' => $retryAfter,
            'identifier' => $identifier
        ];
    }

    /**
     * Emits standard RFC rate limit HTTP headers.
     *
     * @param array{limit: int, remaining: int, reset: int, retryAfter: int, allowed: bool} $result
     */
    public static function emitHeaders(array $result): void {
        if (!headers_sent()) {
            header("X-RateLimit-Limit: {$result['limit']}");
            header("X-RateLimit-Remaining: {$result['remaining']}");
            header("X-RateLimit-Reset: {$result['reset']}");

            if (!$result['allowed'] && $result['retryAfter'] > 0) {
                header("Retry-After: {$result['retryAfter']}");
            }
        }
    }

    /**
     * Guard middleware: Enforces rate limit or automatically emits 429 Too Many Requests response.
     *
     * @param string $action Endpoint category or action identifier (e.g. 'search', 'seat_hold', 'auth')
     * @param int $limit Maximum permitted requests
     * @param int $decaySeconds Window in seconds
     * @param string|null $customIdentifier Custom identifier (e.g. user ID or session ID). Defaults to client IP.
     */
    public static function enforce(string $action = 'general', int $limit = 60, int $decaySeconds = 60, ?string $customIdentifier = null): void {
        // Allow disabling in CLI or specific unit-test harnesses
        if (getenv('RATE_LIMIT_DISABLED') === '1' || (defined('PHP_SAPI') && PHP_SAPI === 'cli' && empty($customIdentifier))) {
            return;
        }

        $identifier = $action . ':' . ($customIdentifier ?? self::resolveClientIp());
        $limiter = new self();
        $result = $limiter->check($identifier, $limit, $decaySeconds);

        self::emitHeaders($result);

        if (!$result['allowed']) {
            if (class_exists('ApiResponse')) {
                ApiResponse::tooManyRequests(
                    "Rate limit exceeded for endpoint [{$action}]. Please retry in {$result['retryAfter']} seconds.",
                    $result['retryAfter']
                );
            } else {
                http_response_code(429);
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'statusCode' => 429,
                    'message' => "Rate limit exceeded for endpoint [{$action}]. Please retry in {$result['retryAfter']} seconds."
                ]);
                exit();
            }
        }
    }

    /**
     * Manually resets a specific bucket (useful for test fixtures or administrative resets).
     */
    public function reset(string $identifier): bool {
        $hashKey = hash('sha256', $identifier);
        $filePath = $this->storageDir . DIRECTORY_SEPARATOR . $hashKey . '.lock';
        if (file_exists($filePath)) {
            return @unlink($filePath);
        }
        return true;
    }

    /**
     * Purges all cached rate-limit lock files.
     */
    public function purgeAll(): int {
        $count = 0;
        $files = glob($this->storageDir . DIRECTORY_SEPARATOR . '*.lock') ?: [];
        foreach ($files as $file) {
            if (@unlink($file)) {
                $count++;
            }
        }
        return $count;
    }
}
