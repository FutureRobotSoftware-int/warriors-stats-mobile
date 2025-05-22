import Chart from "chart.js/auto";

// Múltiples instancias
let charts = {};

export function renderCharts() {
	// Destruir todos los gráficos existentes si ya existen
	for (const key in charts) {
		charts[key].destroy();
	}

	// Reiniciar
	charts = {};

	const ctxMixed = document.getElementById("mixedChart");
	if (ctxMixed) {
		charts.mixedChart = new Chart(ctxMixed, {
			type: "bar",
			data: {
				labels: ["Q1", "Q2", "Q3", "Q4"],
				datasets: [
					{
						label: "Points",
						data: [12, 19, 3, 5],
						backgroundColor: "rgba(54, 162, 235, 0.6)",
					},
					{
						label: "Assists",
						data: [5, 7, 2, 8],
						type: "line",
						borderColor: "rgba(255, 99, 132, 1)",
						borderWidth: 2,
						fill: false,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { position: "top" },
				},
				scales: {
					y: { beginAtZero: true },
				},
			},
		});
	}

	const ctxPie1 = document.getElementById("pieChart1");
	if (ctxPie1) {
		charts.pieChart1 = new Chart(ctxPie1, {
			type: "pie",
			data: {
				labels: ["3PT", "Mid", "Paint"],
				datasets: [
					{
						label: "Shot Distribution",
						data: [40, 25, 35],
						backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
			},
		});
	}

	const ctxPie2 = document.getElementById("pieChart2");
	if (ctxPie2) {
		charts.pieChart2 = new Chart(ctxPie2, {
			type: "pie",
			data: {
				labels: ["Made", "Missed"],
				datasets: [
					{
						data: [70, 30],
						backgroundColor: ["#22c55e", "#ef4444"],
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
			},
		});
	}
}
