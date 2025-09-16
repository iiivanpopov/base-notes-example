import assert from "node:assert";
import test from "node:test";
import { compare, hash } from "../src/utils/password.js";

test("password module", (t) => {
	t.test("hash should return a string with salt and hash", () => {
		const password = "supersecret";
		const passwordHash = hash(password);

		assert.ok(typeof passwordHash === "string", "Hash should be a string");
		const parts = passwordHash.split(".");
		assert.strictEqual(
			parts.length,
			2,
			"Hash should contain salt and hashed value",
		);
		assert.strictEqual(
			parts[0].length,
			32,
			"Salt should be 16 bytes hex => 32 chars",
		);
		assert.strictEqual(
			parts[1].length,
			128,
			"Hash should be 64 bytes hex => 128 chars",
		);
	});

	t.test("compare should return true for correct password", () => {
		const password = "mypassword123";
		const passwordHash = hash(password);

		const result = compare(password, passwordHash);
		assert.strictEqual(result, true, "Correct password should match the hash");
	});

	t.test("compare should return false for incorrect password", () => {
		const password = "mypassword123";
		const wrongPassword = "wrongpassword";
		const passwordHash = hash(password);

		const result = compare(wrongPassword, passwordHash);
		assert.strictEqual(
			result,
			false,
			"Wrong password should not match the hash",
		);
	});
});
