import { parseCSV } from "../csvService";
import { formatToSlug } from "../formatter";
import type { IPlayer } from "../../types/player";
import { usePlayers } from "../stores/players";
import { useShotData } from "../stores/shotData";
import type { IShotData } from "../../types/shotData";

export async function loadPlayers() {
    const parsedData: any = await parseCSV('data/players.csv');

    const playersStore = usePlayers();
    const players: Omit<IPlayer, 'id'>[] = parsedData.map((p: { player: String; number: string; }) => ({
        player: p.player ?? 'Sin nombre',
        data: p.player ? formatToSlug(p.player) : '',
        number: p.number ?? '',
        isSelected: false
    }));

    return playersStore.addPlayers(players);
}

export async function loadFilters() {
    return await parseCSV("data/filters.csv");
}

export async function loadShotData(player: string) {
    const playerSlug = formatToSlug(player);
    const path = `../data/${playerSlug}-Shotdata.csv`;
    const parsedData: any = await parseCSV(path);

    const shotStore = useShotData();
    const entries: Omit<IShotData, 'id'>[] = parsedData;

    shotStore.clearData();

    return shotStore.addData(entries);
}

