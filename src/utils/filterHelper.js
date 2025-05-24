/**
 * Convierte el store de filtros de Alpine (que usa Set) en un objeto plano con arrays.
 * @param {object} filtersStore - Alpine.store("filters")
 * @returns {object} Objeto plano con arreglos
 */
export function flattenFilterStore(filtersStore) {
	return Object.fromEntries(
		Object.entries(filtersStore).map(([key, value]) => [key, [...value]]),
	);
}
