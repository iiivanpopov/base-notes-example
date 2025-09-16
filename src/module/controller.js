import { createUser, getUserByUsername } from "../database/user-repository.js";
import { getJwtFromHeader } from "../utils/headers.js";
import { signJwt, verifyJwt } from "../utils/jwt.js";
import { compare, hash } from "../utils/password.js";
import { addNote, getNotesByUser } from "../utils/storage.js";

export const handleRegister = async (req, res) => {
	let body = "";

	req.on("data", (chunk) => {
		body += chunk;
	});

	req.on("end", async () => {
		const parsed = JSON.parse(body);

		const user = await createUser({
			...parsed,
			passwordHash: hash(parsed.password),
		});

		const tokens = signJwt({ userId: user.id });

		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ success: true, tokens }));
	});
};
export const handleLogin = async (req, res) => {
	let body = "";

	req.on("data", (chunk) => {
		body += chunk;
	});

	req.on("end", async () => {
		const parsed = JSON.parse(body);
		const user = await getUserByUsername(parsed.username);

		if (!user?.password_hash) {
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: false }));
			return;
		}

		const valid = compare(parsed.password, user.password_hash);
		if (!valid) {
			res.writeHead(401, { "Content-Type": "application/json" });
			return res.end(
				JSON.stringify({
					success: false,
					message: "Invalid email or password",
				}),
			);
		}

		const accessToken = signJwt({ userId: user.id });

		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ success: true, accessToken }));
	});
};

export const handleCreateNote = async (req, res) => {
	let body = "";

	req.on("data", (chunk) => {
		body += chunk;
	});

	req.on("end", () => {
		const parsed = JSON.parse(body);
		const token = getJwtFromHeader(req);
		const payload = verifyJwt(token);
		const userId = payload?.userId;
		const note = addNote({
			userId,
			text: parsed.text,
			name: parsed.name,
		});

		res.writeHead(201, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ success: true, note }));
	});
};

export const handleGetNotes = (req, res) => {
	const token = getJwtFromHeader(req);
	const payload = verifyJwt(token);
	const userId = payload?.userId;
	const notes = getNotesByUser(userId);

	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(JSON.stringify({ success: true, notes }));
};

export const handleGetNoteById = (req, res) => {
	const token = getJwtFromHeader(req);
	const payload = verifyJwt(token);
	const userId = payload?.userId;

	const match = req.url.match(/\/notes\/(\d+)/);
	const noteId = match ? Number(match[1]) : undefined;

	const notes = getNotesByUser(userId);
	const note = notes.find((n) => n.id === noteId);

	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(JSON.stringify({ success: true, note }));
};
