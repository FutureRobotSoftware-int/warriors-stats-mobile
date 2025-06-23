import { defineStore } from "pinia";
import type { IShotData } from "../../types/shotData";

export const useShotData = defineStore('shotData', {
    state: (): { entries: IShotData[]; nextId: number } => ({
        entries: [],
        nextId: 0,
    }),
    getters: {
        getAll(state) {
            return state.entries;
        },
    },
    actions: {
        clearData() {
            this.entries = [];
            this.nextId = 0;
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

        getColumnValues<T extends keyof IShotData>(col: T): IShotData[T][] {
            return this.entries.map(entry => entry[col]).filter(val => val !== undefined && val !== null && val !== "") as IShotData[T][];
        },

        getUniqueColumnValues<T extends keyof IShotData>(col: T): IShotData[T][] {
            const values = this.getColumnValues(col);
            return [...new Set(values)];
        },

        getMostCommonColumnValue<T extends keyof IShotData>(col: T): IShotData[T] | null {
            const values = this.getColumnValues(col);
            const countMap: Record<string, number> = {};

            for (const val of values) {
                const key = String(val);
                countMap[key] = (countMap[key] || 0) + 1;
            }

            let mostCommon: string | null = null;
            let maxCount = 0;

            for (const [key, count] of Object.entries(countMap)) {
                if (count > maxCount) {
                    mostCommon = key;
                    maxCount = count;
                }
            }

            if (mostCommon === null) return null;

            // Devuelve el tipo original (string | number)
            const sample = values.find(v => String(v) === mostCommon);
            return sample ?? null;
        },

        calcFG(): string {
            const makes = this.getColumnValues("Make/Miss").filter(val => String(val).trim() === "Make").length;
            const total = this.getColumnValues("Make/Miss").length;

            if (total === 0) return "0";

            const result = Math.round((makes / total) * 100);
            return result.toString(); // o `${result}%`
        },

        calcPPP(): string {
            const points = this.getColumnValues("PTS");
            const total = points.length;

            if (total === 0) return "0.0";

            const sum = points.reduce((a, b) => a + Number(b), 0);
            const result = sum / total;

            return result.toFixed(1);
        },

        calcOffDrb(): string | null {
            return this.getMostCommonColumnValue("Off Dribble Hand");
        }

    }
})