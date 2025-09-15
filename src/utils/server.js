import fs from "node:fs";
import path from "node:path";

const readStatic = (file) => fs.readFileSync(path.resolve("public", file));

const staticFiles = {
	"/": [readStatic("index.html"), "text/html"],
	"/register.html": [readStatic("pages/register.html"), "text/html"],
	"/login.html": [readStatic("pages/login.html"), "text/html"],
	"/dashboard.html": [readStatic("pages/dashboard.html"), "text/html"],
	"/script.js": [readStatic("script.js"), "application/javascript"],
	"/styles.css": [readStatic("styles.css"), "text/css"],
	"/favicon.png": [readStatic("favicon.png"), "image/png"],
};

export const serveStatic = (url, res) => {
	const file = staticFiles[url];

	if (!file) return;

	res.writeHead(200, { "Content-Type": file[1] });
	res.end(file[0]);
};
