import { parseCSV } from "../utils/csvParser.js";
import { groupByCategory } from "../utils/filterBuilder.js";

const filters = await parseCSV("../../data/filters.csv");

const groupedFilters = groupByCategory(filters);

export function playerSelection() {
	return {
		players: [
			"Gary Payton II",
			"Jonathan Kuminga",
			"Taran Armstrong",
			"Brandon Podziemski",
			"Moses Moody",
			"Kevin Looney",
			"Buddy Hield",
			"Jimmy Butler III",
			"Braxton Key",
			"Gui Santos",
			"Quinten Post",
			"Draymond Green",
			"Stephen Curry",
			"Kevin Knox II",
			"Trayce Jackson-Davis",
			"Jackson Rowe",
			"Pat Spencer",
		],
		search: "",
		get filteredPlayers() {
			return this.players
				.filter((player) =>
					player.toLowerCase().includes(this.search.toLowerCase()),
				)
				.map((player) => ({
					name: player,
					data: player.replaceAll(" ", "-"),
				}));
		},
	};
}

export function playerDisplay() {
	return {
		selectedPlayer: {
			name: "Stephen Curry",
			number: 30,
			position: "Point Guard",
			ppg: 29.4,
			preferredAction: "3-Point Shot",
			makeMissRatio: "62 / 38",
			img: "https://i.pravatar.cc/150?img=12",
		},
	};
}

export function getFilters() {
	const filterCategories = Object.entries(groupedFilters).map(
		([category, options]) => ({
			category,
			options,
		}),
	);
	return {
		filtersUI() {
			return {
				filterCategories,
				openCategories: [],
				activeFilters: {},

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
