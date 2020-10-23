$(document).ready(function () {
	const endpoint = "http://api.scb.se/OV0104/v1/doris/sv/ssd/";

	const statistics = [];

	fetch(endpoint)
		.then((blob) => blob.json().then((data) => statistics.push(...data)))
		.then(console.log(statistics));

	function findMatches(wordToMatch, statistics) {
		return statistics.filter((stat) => {
			/* if any stats match what was seached */
			const regex = new RegExp(wordToMatch, "gi");
			return stat.text.match(regex) || stat.id.match(regex);
		});
	}

	function displayMatches() {
		const matchArray = findMatches(this.value, statistics);

		/* if there is valid search result display it */
		if (matchArray.length > 0) {
			const html = matchArray
				.map((res) => {
					const regex = new RegExp(this.value, "gi");
					const texts = res.text.replace(
						regex,
						`<span class="hl">${this.value}</span>`
					);
					return `
          <section>
            <span class="text">${texts}</span>
            <span class="id">${res.id}</span>
          </section>
        `;
				})
				.join("");
			result.innerHTML = html;
		} else {
			result.innerHTML = `<span>inget resultat</span>`;
		}
	}

	const searchInput = document.querySelector("input");
	const result = document.querySelector("#result");

	searchInput.addEventListener("change", displayMatches);
	searchInput.addEventListener("keyup", displayMatches);

	/* light/dark mode */
	let darkMode = localStorage.getItem("darkMode");
	const darkModeToggle = document.querySelector("#dark-mode-toggle");

	const enableDarkMode = () => {
		/* add darkmode class */
		document.body.classList.add("darkmode");
		/* update darkmode in localstorage */
		localStorage.setItem("darkMode", "enabled");
	};

	const disableDarkMode = () => {
		document.body.classList.remove("darkmode");
		localStorage.setItem("darkMode", null);
	};

	if (darkMode === "enabled") {
		enableDarkMode();
	}

	darkModeToggle.addEventListener("click", () => {
		darkMode = localStorage.getItem("darkMode");
		darkMode !== "enabled" ? enableDarkMode() : disableDarkMode();
	});
});
