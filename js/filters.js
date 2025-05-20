export function filtersUI() {
	return {
		filterCategories: [
			{
				category: "Shot Type",
				options: ["3PT", "Mid-Range", "Layup", "Dunk"],
			},
			{
				category: "Defense",
				options: ["Man", "Zone", "Double Team"],
			},
			{
				category: "Quarter",
				options: ["1st", "2nd", "3rd", "4th"],
			},
		],
		openCategories: [],
		activeFilters: {},

		toggleCategory(index) {
			if (this.openCategories.includes(index)) {
				this.openCategories = this.openCategories.filter((i) => i !== index);
			} else {
				this.openCategories.push(index);
			}
		},

		toggleOption(category, option) {
			if (!this.activeFilters[category])
				this.activeFilters[category] = new Set();

			const set = this.activeFilters[category];

			if (set.has(option)) {
				set.delete(option);
			} else {
				set.add(option);
			}

			this.activeFilters[category] = new Set(set);
		},

		isActive(category, option) {
			return this.activeFilters[category]?.has(option) ?? false;
		},

		toggleAll(category, checked) {
			const options = this.filterCategories.find(
				(c) => c.category === category,
			).options;

			if (checked) {
				this.activeFilters[category] = new Set(options);
			} else {
				this.activeFilters[category] = new Set();
			}
		},

		isAllSelected(category) {
			const group = this.filterCategories.find((c) => c.category === category);
			const selected = this.activeFilters[category];
			return selected?.size === group.options.length;
		},
	};
}
