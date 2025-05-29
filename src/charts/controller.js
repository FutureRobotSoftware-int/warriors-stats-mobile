import { parseCSV } from "../utils/csvParser.js";
import {
	renderMixedChart,
	renderPieChart,
	renderThumbChart,
	clearChartInstance,
} from "./renderer.js";
import { getFilteredData, groupByOffensiveActionWithPPP } from "./processor.js";

/**
 * Render pie charts and their thumbnails.
 * @param {Array<Object>} filteredData
 */
export function updateAllPieCharts(filteredData) {
	const configs = [
		{
			field: "Defender Distance",
			title: "Defender Distance",
			canvasId: "pieDD",
			thumbId: "thumbPieDD",
		},
		{
			field: "Make/Miss",
			title: "FG%",
			canvasId: "pieFG",
			thumbId: "thumbPieFG",
		},
		{
			field: "Hop/1-2",
			title: "Footwork",
			canvasId: "pieFoot",
			thumbId: "thumbPieFoot",
		},
		{
			field: "Area",
			title: "Shot Area",
			canvasId: "pieArea",
			thumbId: "thumbPieArea",
		},
		{
			field: "Offensive Action",
			title: "Action",
			canvasId: "pieAction",
			thumbId: "thumbPieAction",
		},
		{
			field: "Pass Direction",
			title: "Pass Direction",
			canvasId: "piePass",
			thumbId: "thumbPiePass",
		},
		{
			field: "Player Direction",
			title: "Player Direction",
			canvasId: "piePlay",
			thumbId: "thumbPiePlay",
		},
		{
			field: "Off Dribble Hand",
			title: "Off Dribble Hand",
			canvasId: "pieOff",
			thumbId: "thumbPieOff",
		},
	];

	// biome-ignore lint/complexity/noForEach: <explanation>
	configs.forEach(({ field, canvasId, thumbId, title }) => {
		const countMap = {};
		// biome-ignore lint/complexity/noForEach: <explanation>
		filteredData.forEach((row) => {
			const key = row[field];
			if (key) countMap[key] = (countMap[key] || 0) + 1;
		});

		const labels = Object.keys(countMap);
		const values = labels.map((k) => countMap[k]);

		renderPieChart(canvasId, labels, values, title);
		if (thumbId) {
			renderThumbChart(thumbId, "pie", labels, values);
		}
	});
}

/**
 * Loads, filters and render all the charts
 * @param {string} csvPath
 */
export async function renderCharts(
	csvPath = "../data/Buddy-Hield-Shotdata.csv",
) {
	clearChartInstance();

	try {
		const rawData = await parseCSV(csvPath);
		const filtered = getFilteredData(rawData);
		const { labels, totals, ppps } = groupByOffensiveActionWithPPP(filtered);
		updateAllPieCharts(filtered);
		renderMixedChart(labels, totals, ppps);
		renderThumbChart("thumbBarChart1", "bar", labels, totals);
	} catch (error) {
		console.error("Error rendering charts:", error);
	}
}
