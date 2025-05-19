export function drawPieChart(data, selector, field) {
	const count = d3
		.rollups(
			data,
			(v) => v.length,
			(d) => d[field],
		)
		.map(([label, value]) => ({ label, value }));

	const svg = d3.select(selector).html("");
	const width = +svg.attr("width"),
		height = +svg.attr("height"),
		radius = Math.min(width, height) / 2;
	const g = svg
		.append("g")
		.attr("transform", `translate(${width / 2},${height / 2})`);

	const color = d3.scaleOrdinal(d3.schemeTableau10);
	const pie = d3.pie().value((d) => d.value);
	const arc = d3.arc().innerRadius(0).outerRadius(radius);

	g.selectAll("path")
		.data(pie(count))
		.join("path")
		.attr("d", arc)
		.attr("fill", (d) => color(d.data.label))
		.attr("stroke", "#fff");

	g.selectAll("text")
		.data(pie(count))
		.join("text")
		.text(
			(d) =>
				`${d.data.label} (${((d.data.value / d3.sum(count, (d) => d.value)) * 100).toFixed(1)}%)`,
		)
		.attr("transform", (d) => `translate(${arc.centroid(d)})`)
		.style("text-anchor", "middle")
		.style("font-size", 12);
}
