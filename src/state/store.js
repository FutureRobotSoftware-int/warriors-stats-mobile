import Alpine from "alpinejs";
import { renderCharts } from "../charts/controller";
import { formatToSlug } from "../utils/formatter";

//Initializes stores with default values
export function initStore(defaults = {}) {
	document.addEventListener("alpine:init", () => {
		Alpine.store("tab", defaults.tab || "resume");
		Alpine.store("filters", defaults.filters || {});
		Alpine.store("selected", defaults.selected || "Buddy Hield");
	});
}

export function getSelectedPlayer() {
	return Alpine.store("selected") || null;
}

export function setSelectedPlayer(name) {
	Alpine.store("selected", name);
}

export function getActiveFilters() {
	return Alpine.store("filters");
}

//Update filters and reloads charts
export function updateFilterCategory(category, values) {
	const currentPlayer = getSelectedPlayer();
	const dataPlayer = formatToSlug(currentPlayer);

	Alpine.store("filters")[category] = new Set(values);

	renderCharts(`../data/${dataPlayer}-Shotdata.csv`);
}
