import { describe, expect, it } from "vitest";

import { getSecurityHeaders } from "./security";

describe("getSecurityHeaders", () => {
	it("sets baseline browser protections in every environment", () => {
		const headers = getSecurityHeaders(false);

		expect(headers).toMatchObject({
			"Content-Security-Policy-Report-Only":
				expect.stringContaining("default-src 'self'"),
			"Permissions-Policy": "camera=(), geolocation=(), microphone=()",
			"Referrer-Policy": "strict-origin-when-cross-origin",
			"X-Content-Type-Options": "nosniff",
			"X-Frame-Options": "DENY",
		});
		expect(headers).not.toHaveProperty("Strict-Transport-Security");
	});

	it("adds HSTS only to production responses", () => {
		expect(getSecurityHeaders(true)).toHaveProperty(
			"Strict-Transport-Security",
			"max-age=31536000; includeSubDomains",
		);
	});
});
