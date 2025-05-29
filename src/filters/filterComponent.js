import { loadFilters } from "../data/dataLoader.js";
import { groupByCategory } from "./filterUtils.js";
import { getActiveFilters, updateFilterCategory } from "../state/store.js";

export function filterComponent() {
	return {
		filtersUI() {
			return {
				filterCategories: [],
				openCategories: [],
				activeFilters: getActiveFilters(),

				async init() {
					const raw = await loadFilters();
					this.filterCategories = Object.entries(groupByCategory(raw)).map(
						([category, options]) => ({ category, options }),
					);
					updateFilterCategory("Year", ["2024-2025"]);
				},

				toggleCategory(index) {
					if (this.openCategories.includes(index)) {
						this.openCategories = this.openCategories.filter(
							(i) => i !== index,
						);
					} else {
						this.openCategories.push(index);
					}
				},

				toggleOption(category, option) {
					if (!this.activeFilters[category]) {
						this.activeFilters[category] = new Set();
					}
					const set = this.activeFilters[category];

					if (set.has(option)) {
						set.delete(option);
					} else {
						set.add(option);
					}

					updateFilterCategory(category, set);
				},

				isActive(category, option) {
					return this.activeFilters[category]?.has(option) ?? false;
				},

				toggleAll(category, checked) {
					const options = this.filterCategories.find(
						(c) => c.category === category,
					).options;
					updateFilterCategory(category, checked ? options : []);
				},

				isAllSelected(category) {
					const group = this.filterCategories.find(
						(c) => c.category === category,
					);
					const selected = this.activeFilters[category];
					return selected?.size === group.options.length;
				},
			};
		},
	};
}
