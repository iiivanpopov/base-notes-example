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

	const btn = document.createElement("button");
	const i = document.createElement("i");
	i.className = "fa-solid fa-arrow-right-from-bracket";
	btn.appendChild(i);

	const span = document.createElement("span");
	span.className = "link";
	span.textContent = "Logout";
	btn.appendChild(span);

	nav.appendChild(btn);

	return aside;
}

const sidebar = createSidebar();

document.body.appendChild(sidebar);

sidebar.addEventListener("click", (event) => {
	if (event.target.classList.contains("sidebar")) {
		sidebar.classList.toggle("closed");
	}
});
