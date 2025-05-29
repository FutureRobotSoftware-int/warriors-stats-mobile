import { getActiveFilters } from "../state/store.js";
import { flattenFilterStore } from "../filters/filterUtils.js";

/**
 * Filter data based on the current active filters.
 * @param {Array<Object>} data
 * @returns {Array<Object>} Filtered Data
 */
export function getFilteredData(data) {
	const activeFilters = flattenFilterStore(getActiveFilters());
	return data.filter((row) =>
		Object.entries(activeFilters).every(
			([key, values]) => !values.length || values.includes(row[key]),
		),
	);
}

/**
 * Group data by Offensive actiond and calculates PPP (Points per posession).
 * @param {Array<Object>} data
 * @returns {{ labels: string[], totals: number[], ppps: string[] }}
 */
export function groupByOffensiveActionWithPPP(data) {
	const grouped = {};

	// biome-ignore lint/complexity/noForEach: <explanation>
	data.forEach(({ "Offensive Action": action, PTS }) => {
		const pts = Number(PTS);
		// biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
		if (!action || isNaN(pts)) return;

		if (!grouped[action]) grouped[action] = { totalShots: 0, totalPoints: 0 };
		grouped[action].totalShots++;
		grouped[action].totalPoints += pts;
	});

	const labels = Object.keys(grouped);
	const totals = labels.map((action) => grouped[action].totalShots);
	const ppps = labels.map((action) =>
		(grouped[action].totalPoints / grouped[action].totalShots).toFixed(2),
	);

	return { labels, totals, ppps };
}
