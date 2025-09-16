import {
	handleCreateNote,
	handleGetNoteById,
	handleGetNotes,
	handleLogin,
	handleRegister,
} from "./controller.js";

const noteIdRegex = /^\/notes\/(\d+)$/;

export const router = async (req, res) => {
	const url = req.url;
	const method = req.method;

	if (url === "/register" && method === "POST") handleRegister(req, res);
	if (url === "/login" && method === "POST") return handleLogin(req, res);
	if (url === "/notes" && method === "POST") return handleCreateNote(req, res);
	if (url === "/notes" && method === "GET") return handleGetNotes(req, res);
	const noteIdMatch = url.match(noteIdRegex);
	if (noteIdMatch && method === "GET") return handleGetNoteById(req, res);
};
