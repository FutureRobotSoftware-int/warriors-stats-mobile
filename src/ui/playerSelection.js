import { loadPlayers } from "../data/dataLoader.js";
import { formatToSlug } from "../utils/formatter.js";

export function playerSelectionComponent() {
	return {
		players: [],
		search: "",

		async init() {
			const data = await loadPlayers();
			this.players = data.map((row) => row.Player).filter(Boolean);
		},

		get filteredPlayers() {
			return this.players
				.filter((name) =>
					name.toLowerCase().includes(this.search.toLowerCase()),
				)
				.map((name) => ({
					name,
					data: formatToSlug(name),
				}));
		},
	};
}
