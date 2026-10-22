export function getSecurityHeaders(isProduction: boolean) {
	return {
		"Content-Security-Policy-Report-Only": [
			"default-src 'self'",
			"base-uri 'self'",
			"form-action 'self'",
			"frame-ancestors 'none'",
			"img-src 'self' data: https:",
			"script-src 'self' 'unsafe-inline'",
			"style-src 'self' 'unsafe-inline'",
			"font-src 'self' data: https:",
			"connect-src 'self' https:",
			"object-src 'none'",
		].join("; "),
		"Permissions-Policy": "camera=(), geolocation=(), microphone=()",
		"Referrer-Policy": "strict-origin-when-cross-origin",
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options": "DENY",
		...(isProduction
			? { "Strict-Transport-Security": "max-age=31536000; includeSubDomains" }
			: {}),
	};
}
