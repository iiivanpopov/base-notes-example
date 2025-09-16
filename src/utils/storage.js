import fs from "node:fs";
import path from "node:path";

const storage = {
	notes: [],
};

try {
	const file = fs.readFileSync(path.resolve("db.json"));
	if (file) {
		storage.notes = JSON.parse(file).notes;
	}
} catch (error) {
	console.error(error);
}

const saveNotes = () =>
	fs.writeFileSync(
		path.resolve("db.json"),
		JSON.stringify({ notes: storage.notes }),
	);

export const addNote = ({ userId, text, name }) => {
	const note = {
		id:
			storage.notes.length > 0
				? storage.notes[storage.notes.length - 1].id + 1
				: 1,
		userId,
		text,
		name,
	};

	storage.notes.push(note);

	saveNotes();
	return note;
};

export const getNotesByUser = (userId) =>
	storage.notes.filter((n) => n.userId === userId);
