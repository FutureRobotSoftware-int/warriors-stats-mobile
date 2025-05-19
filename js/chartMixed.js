export function drawMixedChart(data, selector) {
	const stats = d3
		.rollups(
			data,
			(v) => ({
				total: v.length,
				ppp: d3.mean(v, (d) => d.PTS),
			}),
			(d) => d["Offensive Action"],
		)
		.map(([label, d]) => ({ label, ...d }));

	const svg = d3.select(selector).html("");
	const width = +svg.attr("width") - 100;
	const height = +svg.attr("height") - 60;
	const g = svg.append("g").attr("transform", "translate(50,30)");

	const x = d3
		.scaleBand()
		.domain(stats.map((d) => d.label))
		.range([0, width])
		.padding(0.2);
	const yL = d3
		.scaleLinear()
		.domain([0, d3.max(stats, (d) => d.total)])
		.range([height, 0]);
	const yR = d3.scaleLinear().domain([0, 3.5]).range([height, 0]);

	g.append("g").call(d3.axisLeft(yL));
	g.append("g")
		.attr("transform", `translate(${width},0)`)
		.call(d3.axisRight(yR));
	g.append("g")
		.attr("transform", `translate(0,${height})`)
		.call(d3.axisBottom(x));

	g.selectAll("rect")
		.data(stats)
		.join("rect")
		.attr("x", (d) => x(d.label))
		.attr("y", (d) => yL(d.total))
		.attr("width", x.bandwidth())
		.attr("height", (d) => height - yL(d.total))
		.attr("fill", "orange");

	const line = d3
		.line()
		.x((d) => x(d.label) + x.bandwidth() / 2)
		.y((d) => yR(d.ppp));
	g.append("path")
		.datum(stats)
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-width", 2)
		.attr("d", line);

	g.selectAll("circle")
		.data(stats)
		.join("circle")
		.attr("cx", (d) => x(d.label) + x.bandwidth() / 2)
		.attr("cy", (d) => yR(d.ppp))
		.attr("r", 4)
		.attr("fill", "steelblue");
}
