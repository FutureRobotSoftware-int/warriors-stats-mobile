let filterOptions = new Map();
let currentFilters = {};

export function loadFilterMetadata(path) {
	return d3.dsv(";", path).then((data) => {
		console.log(data[0]);
		filterOptions = d3.group(data, (d) => d.Category);
		filterOptions.forEach((vals, key) => {
			currentFilters[key] = vals.map((v) => v.Value); // Select all by default
		});
		return filterOptions;
	});
}

export function buildFilterUIFromMetadata(containerSelector, onChange) {
	const container = d3.select(containerSelector).html("");

	filterOptions.forEach((values, category) => {
		const section = container
			.append("div")
			.attr("class", "filter-group")
			.attr("data-field", category);
		section.append("strong").text(category);

		section
			.append("label")
			.html(
				`<input type="checkbox" class="filter-all" data-field="${category}" checked> All`,
			);

		values.forEach((v) => {
			section.append("label").html(`
        <input type="checkbox" class="filter-item" data-field="${category}" value="${v.Value}" checked> ${v.Value}
      `);
		});
	});

	setupFilterEvents(onChange);
}

function setupFilterEvents(onChange) {
	d3.selectAll(".filter-all").on("change", function () {
		const field = this.dataset.field;
		const checked = this.checked;
		d3.selectAll(`input.filter-item[data-field="${field}"]`).property(
			"checked",
			checked,
		);
		currentFilters[field] = checked
			? d3
					.selectAll(`input.filter-item[data-field="${field}"]`)
					.nodes()
					.map((n) => n.value)
			: [];
		onChange();
	});

	d3.selectAll(".filter-item").on("change", function () {
		const field = this.dataset.field;
		const selected = d3
			.selectAll(`input.filter-item[data-field="${field}"]:checked`)
			.nodes()
			.map((n) => n.value);
		currentFilters[field] = selected;
		const total = d3
			.selectAll(`input.filter-item[data-field="${field}"]`)
			.size();
		const checked = selected.length;
		d3.select(`input.filter-all[data-field="${field}"]`).property(
			"checked",
			total === checked,
		);
		onChange();
	});
}

export function getCurrentFilters() {
	return currentFilters;
}

export function resetFilters() {
	Object.keys(currentFilters).forEach((f) => (currentFilters[f] = []));
	d3.selectAll(".filter-item").property("checked", false);
	d3.selectAll(".filter-all").property("checked", false);
}
