import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const hash = (password) => {
	const salt = randomBytes(16).toString("hex");

	const hashed = scryptSync(password, salt, 64).toString("hex");

	return `${salt}.${hashed}`;
};

export const compare = (password, passwordHash) => {
	const [salt, hashed] = passwordHash.split(".");

	const hashToCheck = scryptSync(password, salt, 64);

	return timingSafeEqual(Buffer.from(hashed, "hex"), hashToCheck);
};
