import http from "node:http";
import { config } from "./config.js";
import { serveStatic } from "./utils/server.js";

http
	.createServer((req, res) => {
		const url = req.url;

		serveStatic(url, res);
	})
	.listen(config.port, () => console.log(`Listening localhost:${config.port}`));
