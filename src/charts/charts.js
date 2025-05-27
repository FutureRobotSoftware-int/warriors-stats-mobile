import Chart from "chart.js/auto";
import { parseCSV } from "../utils/csvParser.js";
import { flattenFilterStore } from "../utils/filterHelper.js";

const pieCharts = {};
const thumbCharts = {};
let chartInstance = null;
let rawData = [];

// =================== UTILITY ===================
function getFilteredData(data, filters) {
	return data.filter((row) =>
		Object.entries(filters).every(
			([key, values]) => !values.length || values.includes(row[key]),
		),
	);
}

function groupByOffensiveActionWithPPP(data) {
	const grouped = {};
	// biome-ignore lint/complexity/useLiteralKeys: <explanation>
	// biome-ignore lint/complexity/noForEach: <explanation>
	data.forEach(({ ["Offensive Action"]: action, PTS }) => {
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

// =================== CHART RENDERERS ===================
function renderMixedChart(labels, total, ppps) {
	const canvas = document.getElementById("barChart1");
	if (!canvas) return;
	const ctx = canvas.getContext("2d");
	if (chartInstance) chartInstance.destroy();

	chartInstance = new Chart(ctx, {
		type: "bar",
		data: {
			labels,
			datasets: [
				{
					type: "bar",
					label: "Possessions",
					data: total,
					backgroundColor: "rgba(255, 195, 0, 0.6)",
					yAxisID: "y",
					order: 2,
				},
				{
					type: "line",
					label: "PPP",
					data: ppps,
					backgroundColor: "rgba(51, 168, 255, 0.6)",
					borderColor: "rgba(51, 168, 255, 1)",
					fill: false,
					yAxisID: "y1",
					order: 1,
				},
			],
		},
		options: {
			responsive: true,
			interaction: {
				mode: "index",
				intersect: false,
			},
			scales: {
				y: {
					beginAtZero: true,
					title: { display: true, text: "Total Plays" },
				},
				y1: {
					beginAtZero: true,
					suggestedMax: 3.5,
					position: "right",
					grid: { drawOnChartArea: false },
					title: { display: true, text: "PPP" },
				},
			},
		},
	});
}

function renderPieChart(canvasId, labels, values, title) {
	const canvas = document.getElementById(canvasId);
	if (!canvas) return;
	const ctx = canvas.getContext("2d");
	if (pieCharts[canvasId]) pieCharts[canvasId].destroy();

	pieCharts[canvasId] = new Chart(ctx, {
		type: "pie",
		data: {
			labels,
			datasets: [
				{
					data: values,
					backgroundColor: [
						"#4bc0c0",
						"#ff6384",
						"#ffcd56",
						"#36a2eb",
						"#9966ff",
						"#ff9f40",
						"#c9cbcf",
						"#8bcdcd",
					],
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				title: { display: true, text: title },
				tooltip: {
					callbacks: {
						label: ({ parsed, dataset }) => {
							const total = dataset.data.reduce((a, b) => a + b, 0);
							const percentage = ((parsed / total) * 100).toFixed(1);
							return `${parsed} (${percentage}%)`;
						},
					},
				},
				legend: {
					position: "left",
					labels: {
						boxWidth: 20,
					},
				},
			},
		},
	});
}

function renderThumbnailChart(canvasId, type, labels, data, title = "") {
	const canvas = document.getElementById(canvasId);
	if (!canvas) return;

	const ctx = canvas.getContext("2d");

	// 💥 Destruir si ya hay una instancia previa
	if (thumbCharts[canvasId]) {
		thumbCharts[canvasId].destroy();
	}

	thumbCharts[canvasId] = new Chart(ctx, {
		type,
		data: {
			labels,
			datasets: [
				{
					data,
					backgroundColor: "#FFF",
					borderColor: "#041e42",
				},
			],
		},
		options: {
			responsive: true,
			animation: false,
			plugins: {
				legend: { display: false },
				title: {
					display: !!title,
					text: title,
					font: { size: 10 },
				},
				tooltip: { enabled: false },
			},
			scales: {
				y: { display: false },
				x: { display: false },
			},
		},
	});
}

function updateAllPieCharts(filteredData) {
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

	configs.forEach(({ field, title, canvasId, thumbId }) => {
		const countMap = {};
		filteredData.forEach((row) => {
			const key = row[field];
			if (key) countMap[key] = (countMap[key] || 0) + 1;
		});

		const labels = Object.keys(countMap);
		const values = labels.map((k) => countMap[k]);

		renderPieChart(canvasId, labels, values, title);
		if (thumbId) {
			renderThumbnailChart(thumbId, "pie", labels, values);
		}
	});
}

// =================== ENTRY POINT ===================
export async function renderCharts(
	source = "../data/Buddy-Hield-Shotdata.csv",
) {
	rawData = await parseCSV(source);

	const rawFilters = Alpine.store("filters");
	const filters = flattenFilterStore(rawFilters);

	const filtered = getFilteredData(rawData, filters);

	const { labels, totals, ppps } = groupByOffensiveActionWithPPP(filtered);

	updateAllPieCharts(filtered);
	renderMixedChart(labels, totals, ppps);
	renderThumbnailChart("thumbBarChart1", "bar", labels, totals);
}
