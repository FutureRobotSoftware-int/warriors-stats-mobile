import { defineStore } from "pinia";
import type { IShotData } from "../../types/shotData";

export const useShotData = defineStore('shotData', {
    state: (): { entries: IShotData[]; nextId: number } => ({
        entries: [],
        nextId: 0,
    }),
    getters: {
        getArea(state) {
            return state.entries.filter((entry) => entry.Area)
        },
        getPlDir(state) {
            return state.entries.filter((entry) => entry["Player Direction"])
        },
        getPsDir(state) {
            return state.entries.filter((entry) => entry["Pass Direction"])
        },
        getOffAct(state) {
            return state.entries.filter((entry) => entry["Offensive Action"])
        },
        getFootwork(state) {
            return state.entries.filter((entry) => entry["Hop/1-2"])
        },
        getMakeMiss(state) {
            return state.entries.filter((entry) => entry["Make/Miss"])
        },
        getOffDrb(state) {
            return state.entries.filter((entry) => entry["Off Dribble Hand"])
        },
        getDefDist(state) {
            return state.entries.filter((entry) => entry["Defender Distance"])
        },
        getPTS(state) {
            return state.entries.filter((entry) => entry.PTS)
        },
        getYear(state) {
            return state.entries.filter((entry) => entry.Year)
        },
    },
    actions: {
        clearData() {
            this.entries = [];
        },
        addData(newEntry: Omit<IShotData, 'id'>[]) {
            newEntry.forEach(p => {
                this.entries.push({
                    id: this.nextId++,
                    ...p
                });
            });

            return this.entries.length;
        },
        calcFG() {
            if (!this.entries.length) return 0;

            const shots = this.getMakeMiss;
            const total = shots.length;
            if (total === 0) return 0;

            const makes = shots.filter(shot => shot["Make/Miss"]?.trim() === "Make").length

            const result = Math.round((makes / total) * 100);

            return result.toString();
        }


    }
})