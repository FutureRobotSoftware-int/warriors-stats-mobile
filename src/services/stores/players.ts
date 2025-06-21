import { defineStore } from "pinia";
import type { IPlayer } from "../../types/player";

export const usePlayers = defineStore('players', {
    state: (): { players: IPlayer[]; nextId: number } => ({
        players: [],
        nextId: 0,
    }),
    getters: {
        selectedPlayer(state) {
            return state.players.filter((player) => player.isSelected);
        },
        allPlayers(state) {
            return state.players;
        }
    },
    actions: {
        addPlayers(newPlayer: Omit<IPlayer, 'id'>[]) {
            newPlayer.forEach(p => {
                this.players.push({
                    id: this.nextId++,
                    ...p
                })
            })
        }
    }
})