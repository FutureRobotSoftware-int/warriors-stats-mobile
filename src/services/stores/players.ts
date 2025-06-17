import { defineStore } from "pinia";
import type { Player } from "../../types/player";

export const usePlayers = defineStore('players', {
    state: (): { players: Player[]; nextId: number } => ({
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
        addPlayers(newPlayer: Omit<Player, 'id'>[]) {
            newPlayer.forEach(p => {
                this.players.push({
                    id: this.nextId++,
                    ...p
                })
            })
        }
    }
})