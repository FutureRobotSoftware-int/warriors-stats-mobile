export function groupByCategory(data) {
	const result = {};

	// biome-ignore lint/complexity/noForEach: <explanation>
	data.forEach(({ Category, Value }) => {
		if (!result[Category]) {
			result[Category] = new Set();
		}
		result[Category].add(Value);
	});

	// Convert the set into an Array
	for (const key in result) {
		result[key] = Array.from(result[key]);
	}

	return result;
}
