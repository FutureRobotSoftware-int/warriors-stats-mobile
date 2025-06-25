import { defineStore } from 'pinia'

export const useGraphFilters = defineStore('graphFilters', {
    state: () => ({
        selectedFilters: {} as Record<string, string>,
        hiddenCategories: {} as Record<string, Set<string>>,
        activeSource: null as string | null
    }),

    actions: {
        setFilter(field: string, value: string) {
            if (this.selectedFilters[field] === value) {
                delete this.selectedFilters[field]
                if (this.activeSource === field) this.activeSource = null
            } else {
                this.selectedFilters[field] = value
                this.activeSource = field
            }
            console.log(this.selectedFilters)
        },

        clearFilter(field: string) {
            delete this.selectedFilters[field]
            if (this.activeSource === field) this.activeSource = null
        },

        toggleCategoryVisibility(field: string, category: string) {
            // if (!this.hiddenCategories[field]) {
            //     this.hiddenCategories[field] = new Set()
            // }

            // if (this.hiddenCategories[field].has(category)) {
            //     this.hiddenCategories[field].delete(category)
            // } else {
            //     this.hiddenCategories[field].add(category)
            // }
            // console.log(this.hiddenCategories)
        },

        clearAll() {
            this.selectedFilters = {}
            this.hiddenCategories = {}
            this.activeSource = null
        }
    }
})
