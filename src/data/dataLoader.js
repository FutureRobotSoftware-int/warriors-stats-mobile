import { parseCSV } from "../utils/csvParser.js";
import { formatToSlug } from "../utils/formatter.js";

export async function loadPlayers() {
	return await parseCSV("data/players.csv");
}

export async function loadFilters() {
	return await parseCSV("data/filters.csv");
}

export async function loadShotData(player) {
	const playerSlug = formatToSlug(player);
	console.log(playerSlug);
	const path = `../data/${playerSlug}-Shotdata.csv`;
	return await parseCSV(path);
}
