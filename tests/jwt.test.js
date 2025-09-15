import assert from "node:assert";
import test from "node:test";
import { signJwt, verifyJwt } from "../src/utils/jwt.js";

const payload = { userId: 123 };

test("jwt module", (t) => {
	t.test("should encode a valid token", () => {
		const token = signJwt(payload, 15 * 60);

		assert.strictEqual(token.split(".").length, 3, "Token should have 3 parts");
	});

	t.test("should decode a valid token", () => {
		const token = signJwt(payload, 15 * 60);
		const decoded = verifyJwt(token);

		assert.strictEqual(decoded.userId, payload.userId);
	});

	t.test("should fail decoding an expired token", () => {
		const expiredToken = signJwt(payload, -15 * 60);
		const decoded = verifyJwt(expiredToken);

		assert.strictEqual(decoded, null, "Expired token should return null");
	});
});
