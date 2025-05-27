import { parseCSV } from "../utils/csvParser.js";
import { groupByCategory } from "../utils/filterBuilder.js";
import Alpine from "alpinejs";

const filters = await parseCSV("../../data/filters.csv");

const groupedFilters = groupByCategory(filters);

const playerData = await parseCSV("../../data/players.csv");

const name = playerData.map((row) => row.Player).filter(Boolean);

export function playerSelection() {
	return {
		players: name,
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

export function playerDisplay(initialPlayer = "Moses Moody") {
	return {
		selectedPlayer: {},

		updatePlayer() {
			const selectedName = Alpine.store("selected") || initialPlayer;
			const playerResume = playerData.find(
				(row) => row.Player === selectedName,
			);
			if (playerResume) {
				this.selectedPlayer = {
					name: playerResume.Player,
					number: playerResume.Number,
					position: playerResume.Position,
					ppg: 29.4, // Asigna valores reales si los tienes
					preferredAction: "3-Point Shot",
					makeMissRatio: "62 / 38",
					img: playerResume.Image,
				};
			}
		},

		init() {
			this.updatePlayer();
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
				activeFilters: Alpine.store("filters"), // Store reference

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

					// Refresh
					this.activeFilters[category] = new Set(set);
				},

				isActive(category, option) {
					return this.activeFilters[category]?.has(option) ?? false;
				},

				toggleAll(category, checked) {
					const options = this.filterCategories.find(
						(c) => c.category === category,
					).options;

					this.activeFilters[category] = checked ? new Set(options) : new Set();
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
