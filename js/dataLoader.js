export function loadCSV(path) {
	return d3.dsv(";", path, d3.autoType); // Auto-casts strings, numbers, dates
}
