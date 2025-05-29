import Chart from "chart.js/auto";
import { getResponsiveRadius } from "../utils/resListener";

let chartInstance = null;
const pieCharts = {};
const thumbCharts = {};

/**
 * Renders a Mixed Chart (barras + línea) to the canvas with Id "barChart1".
 * @param {string[]} labels
 * @param {number[]} total
 * @param {string[]} ppps
 */
export function renderMixedChart(labels, total, ppps) {
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

/**
 * Renders a Pie Chart to the reiterative id
 * @param {string} containerId
 * @param {string[]} labels
 * @param {number[]} values
 */
export function renderPieChart(containerId, labels, values, title) {
	const canvas = document.getElementById(containerId);
	if (!canvas) return;
	const ctx = canvas.getContext("2d");

	if (pieCharts[containerId]) pieCharts[containerId].destroy();

	pieCharts[containerId] = new Chart(ctx, {
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
			radius: getResponsiveRadius,
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

/**
 * Renders a thumbnail version of a chart
 * @param {string} canvasId
 * @param {string[]} labels
 * @param {number[]} data
 */
export function renderThumbChart(canvasId, type, labels, data, title = "") {
	const canvas = document.getElementById(canvasId);
	if (!canvas) return;

	const ctx = canvas.getContext("2d");

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

/**
 * Destroy main chart instance
 */
export function clearChartInstance() {
	if (chartInstance) {
		chartInstance.destroy();
		chartInstance = null;
	}
}
