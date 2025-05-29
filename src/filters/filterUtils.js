/**
 * Groups a list of objects by their category.
 * Example input: [{ Category: "Team", Value: "Warriors" }, ...]
 * Output: { Team: ["Warriors", ...] }
 *
 * @param {Array<Object>} data
 * @returns {Object<string, Array<string>>}
 */
export function groupByCategory(data) {
	const result = {};
	// biome-ignore lint/complexity/noForEach: <explanation>
	data.forEach(({ Category, Value }) => {
		if (!result[Category]) {
			result[Category] = new Set();
		}
		result[Category].add(Value);
	});
	// Converts Set into Array
	for (const key in result) {
		result[key] = Array.from(result[key]);
	}
	return result;
}

/**
 * Converts an Alpine filter store (which uses Sets) into a flat object with arrays.
 * @param {object} filtersStore - Alpine.store("filters")
 * @returns {object} Flat object with arrays
 */
export function flattenFilterStore(filtersStore) {
	return Object.fromEntries(
		Object.entries(filtersStore).map(([key, value]) => [key, [...value]]),
	);
}
