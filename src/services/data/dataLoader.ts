import { parseCSV } from "../csvService";
import { formatToSlug } from "../formatter";
import type { Player } from "../../types/player";
import { usePlayers } from "../stores/players";

export async function loadPlayers() {
    const parsedData = await parseCSV('data/players.csv')

    const playersStore = usePlayers()
    const players: Omit<Player, 'id'>[] = parsedData.map((p: { player: String; number: string; }) => ({
        player: p.player ?? 'Sin nombre',
        data: p.player ? formatToSlug(p.player) : '',
        number: p.number ?? '',
        isSelected: false
    }))

    playersStore.addPlayers(players)
}

export async function loadFilters() {
    return await parseCSV("data/filters.csv");
}

export async function loadShotData(player: String) {
    const playerSlug = formatToSlug(player);
    console.log(playerSlug);
    const path = `../data/${playerSlug}-Shotdata.csv`;
    return await parseCSV(path);
}
