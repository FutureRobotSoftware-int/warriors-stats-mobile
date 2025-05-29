import { loadPlayers } from "../data/dataLoader.js";
import { getSelectedPlayer } from "../state/store.js";
import { parseCSV } from "../utils/csvParser.js";

function calculateStatsFromShots(data) {
	const totalShots = data.length;
	const made = data.filter(
		(row) => row["Make/Miss"] === "Make" && row.Year === "2024-2025",
	).length;
	const missed = totalShots - made;

	const areaCounts = {};
	// biome-ignore lint/complexity/noForEach: <explanation>
	data.forEach((row) => {
		const area = row.Area;
		if (area) {
			areaCounts[area] = (areaCounts[area] || 0) + 1;
		}
	});
	const preferredArea =
		Object.entries(areaCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

	const actionCounts = {};
	// biome-ignore lint/complexity/noForEach: <explanation>
	data.forEach((row) => {
		const action = row["Offensive Action"];
		if (action) {
			actionCounts[action] = (actionCounts[action] || 0) + 1;
		}
	});
	const preferredAction =
		Object.entries(actionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

	return {
		preferredArea,
		preferredAction,
		makeMissRatio: `${made} / ${missed}`,
	};
}

export function playerDisplayComponent(defaultPlayer = "Moses Moody") {
	return {
		selectedPlayer: {},

		async updatePlayer() {
			const selected = getSelectedPlayer() || defaultPlayer;
			const players = await loadPlayers();
			const found = players.find((p) => p.Player === selected);

			if (found) {
				const slug = found.Player.trim().replace(/\s+/g, "-");
				const shotData = await parseCSV(`data/${slug}-Shotdata.csv`);
				const stats = calculateStatsFromShots(shotData);

				this.selectedPlayer = {
					name: found.Player,
					number: found.Number,
					position: found.Position,
					preferredArea: stats.preferredArea,
					preferredAction: stats.preferredAction,
					makeMissRatio: stats.makeMissRatio,
					img: found.Image,
				};
			}
		},

		async init() {
			await this.updatePlayer();
		},
	};
}
