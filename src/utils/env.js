import fs from "node:fs";
import path from "node:path";

const configureEnv = () => {
	const env = fs.readFileSync(path.resolve(process.cwd(), ".env")).toString();

	const lines = env.split(/\r?\n/);

	for (const line of lines) {
		if (!line || line.startsWith("#")) continue;

		let [key, value] = line.split("=");

		if (value.startsWith('"') && value.endsWith('"')) {
			value = value.slice(1, -1).replace(/\\"/g, '"');
		} else if (value.startsWith("'") && value.endsWith("'")) {
			value = value.slice(1, -1).replace(/\\'/g, "'");
		}

		process.env[key] = value;
	}
};

export default configureEnv()