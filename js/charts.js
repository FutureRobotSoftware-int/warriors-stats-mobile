function renderCharts() {
	// Mixed Chart
	new Chart(document.getElementById("mixedChart"), {
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

	// Pie Chart 1
	new Chart(document.getElementById("pieChart1"), {
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

	// Pie Chart 2
	new Chart(document.getElementById("pieChart2"), {
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
