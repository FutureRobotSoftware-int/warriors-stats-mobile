import { loadCSV } from "./dataLoader.js";
import {
	loadFilterMetadata,
	buildFilterUIFromMetadata,
	getCurrentFilters,
	resetFilters,
} from "./filters.js";
import { drawMixedChart } from "./chartMixed.js";
import { drawPieChart } from "./chartPie.js";

let playerData = [];

document.getElementById("playerSelect").addEventListener("change", (e) => {
	resetFilters();
	loadPlayerData(e.target.value);
});

function loadPlayerData(file) {
	loadCSV("data/" + file).then((data) => {
		playerData = data;
		resetFilters();
		renderAllGraphs(playerData);
	});
}

function renderAllGraphs(data) {
	const filtered = filterData(data);
	drawMixedChart(filtered, "#mixedChart");
	drawPieChart(filtered, "#pieChart", "Offensive Action");
}

function filterData(data) {
	const filters = getCurrentFilters();
	return data.filter((row) =>
		Object.entries(filters).every(
			([key, values]) => values.length === 0 || values.includes(row[key]),
		),
	);
}

loadFilterMetadata("data/filters.csv").then(() => {
	buildFilterUIFromMetadata("#filters", () => renderAllGraphs(playerData));
	loadPlayerData("Buddy-Hield-Shotdata.csv");
});
