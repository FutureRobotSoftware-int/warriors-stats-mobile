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
    const makeCounts = {};
    const attemptCounts = {};

    filteredData.forEach((row) => {
      const key = row[field];
      if (!key) return;

      // Contar frecuencia
      countMap[key] = (countMap[key] || 0) + 1;

      // Contar makes y attempts solo si existe "Make/Miss"
      const makeMiss = row["Make/Miss"];
      if (makeMiss) {
        attemptCounts[key] = (attemptCounts[key] || 0) + 1;
        if (makeMiss === "Make") {
          makeCounts[key] = (makeCounts[key] || 0) + 1;
        }
      }
    });

    const labels = Object.keys(countMap);
    const values = labels.map((k) => countMap[k]);
    const fgPercentages = labels.map((k) => {
      const makes = makeCounts[k] || 0;
      const attempts = attemptCounts[k] || 0;
      return attempts > 0 ? ((makes / attempts) * 100).toFixed(1) : "0.0";
    });

    // Pasa los fgPercentages al renderizador
    renderPieChart(canvasId, labels, values, title, fgPercentages);
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
