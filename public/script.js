function createLink(href, iconClass, text) {
	const a = document.createElement("a");
	a.href = href;

	const i = document.createElement("i");
	i.className = iconClass;
	a.appendChild(i);

	const span = document.createElement("span");
	span.className = "link";
	span.textContent = text;
	a.appendChild(span);

	return a;
}

function createSidebar() {
	const aside = document.createElement("aside");
	aside.className = "sidebar closed";

	const nav = document.createElement("nav");
	nav.className = "sidebar__nav";
	aside.appendChild(nav);

	nav.appendChild(
		createLink("dashboard.html", "fa-solid fa-grip", "Dashboard"),
	);
	nav.appendChild(
		createLink("login.html", "fa-solid fa-right-to-bracket", "Login"),
	);
	nav.appendChild(
		createLink("register.html", "fa-solid fa-user-plus", "Register"),
	);

	return aside;
}

const sidebar = createSidebar();

document.body.appendChild(sidebar);

sidebar.addEventListener("click", (event) => {
	if (event.target.classList.contains("sidebar")) {
		sidebar.classList.toggle("closed");
	}
});

const LOCAL_STORAGE = {
	accessToken: "accessToken",
};

const redirect = (location) => {
	window.location.href = location;
};

const $api = {
	login: (username, password) =>
		fetch("/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password,
			}),
		}),
	register: (username, email, password) =>
		fetch("/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				email,
				password,
			}),
		}),

	createNote: (note, token) =>
		fetch("/notes", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(note),
		}),
	getNotes: (token) =>
		fetch("/notes", {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		}),
	getNote: (id, token) =>
		fetch(`/notes/${id}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),
};

const setupRegister = (registerSection) => {
	const usernameInput = registerSection.querySelector(".username");
	const emailInput = registerSection.querySelector(".email");
	const passwordInput = registerSection.querySelector(".password");
	const submitButton = registerSection.querySelector(".button");

	submitButton.addEventListener("click", async (event) => {
		event.preventDefault();
		const username = usernameInput.value;
		const email = emailInput.value;
		const password = passwordInput.value;

		const response = await $api.register(username, email, password);

		const body = await response.json();

		if (!response.ok) return;

		localStorage.setItem(LOCAL_STORAGE.accessToken, body.accessToken);
		redirect("/dashboard.html");
	});
};

const setupLogin = (loginSection) => {
	const emailInput = loginSection.querySelector(".input");
	const passwordInput = loginSection.querySelector(".password");
	const submitButton = loginSection.querySelector(".button");

	submitButton.addEventListener("click", async (event) => {
		event.preventDefault();
		const email = emailInput.value;
		const password = passwordInput.value;

		const response = await $api.login(email, password);
		const body = await response.json();
		console.log(body);

		if (!response.ok) return;

		localStorage.setItem(LOCAL_STORAGE.accessToken, body.accessToken);
		redirect("/dashboard.html");
	});
};

const setupNotes = (dashboardSection) => {
	const addNewButton = dashboardSection.querySelector(".notes-list__new");

	addNewButton.addEventListener("click", async (e) => {
		e.preventDefault();
		const name = dashboardSection.querySelector(".note-name").value;
		const text = dashboardSection.querySelector(".note-text").value;
		const token = localStorage.getItem(LOCAL_STORAGE.accessToken);

		await $api.createNote({ name, text }, token);
	});

	const notesList = document.querySelector(".notes-list");

	window.addEventListener("DOMContentLoaded", async () => {
		const token = localStorage.getItem(LOCAL_STORAGE.accessToken);

		const response = await $api.getNotes(token);
		const body = await response.json();

		if (!response.ok) return;

		notesList.innerHTML = "";

		(body.notes || []).forEach((note) => {
			const li = document.createElement("li");
			li.textContent = `${note.id}: ${note.name}`;
			li.dataset.id = note.id;
			notesList.appendChild(li);
		});
	});

	const noteNameInput = document.querySelector(".note-editor .input");
	const noteTextarea = document.querySelector(".note-editor .note-textarea");

	let selectedLi = null;

	notesList.addEventListener("click", async (e) => {
		const li = e.target.closest("li[data-id]");

		if (!li) return;

		const id = li.dataset.id;
		const token = localStorage.getItem(LOCAL_STORAGE.accessToken);
		const response = await $api.getNote(id, token);
		const body = await response.json();

		if (!response.ok) return;

		if (noteNameInput && noteTextarea) {
			noteNameInput.value = body.note?.name || "";
			noteTextarea.value = body.note?.text || "";
		}

		if (selectedLi) selectedLi.classList.remove("active-note");
		li.classList.add("active-note");
		selectedLi = li;
	});
};

const registerSection = document.querySelector(".register-section");
if (registerSection) setupRegister(registerSection);

const loginSection = document.querySelector(".login-section");
if (loginSection) setupLogin(loginSection);

const dashboardSection = document.querySelector(".dashboard-section");
if (dashboardSection) setupNotes(dashboardSection);
