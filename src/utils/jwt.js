import { createHmac } from "node:crypto";
import { config } from "../config.js";

const base64UrlEncode = (obj) => {
	const json = JSON.stringify(obj);

	return Buffer.from(json)
		.toString("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
};

const signSignature = (encodedHeader, encodedPayload) => {
	return createHmac("sha256", config.jwtSecret)
		.update(`${encodedHeader}.${encodedPayload}`)
		.digest("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
};

export const signJwt = (payload, expiresIn) => {
	const encodedHeader = base64UrlEncode({ alg: "HS256", typ: "JWT" });
	const encodedPayload = base64UrlEncode({
		...payload,
		exp: Math.floor(Date.now() / 1000) + expiresIn,
		iat: Math.floor(Date.now() / 1000),
	});
	const signature = signSignature(encodedHeader, encodedPayload);

	return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const verifyJwt = (token) => {
	const [encodedHeader, encodedPayload, signature] = token.split(".");

	const expectedSignature = signSignature(encodedHeader, encodedPayload);

	if (signature !== expectedSignature) return null;

	const payload = JSON.parse(
		Buffer.from(encodedPayload, "base64").toString("utf-8"),
	);

	if (payload.exp && Date.now() / 1000 > payload.exp) return null;

	return payload;
};
