function chartsCarousel() {
	return {
		embla: null,
		init() {
			this.embla = EmblaCarousel(this.$el.querySelector(".embla"), {
				loop: false,
				align: "start",
				containScroll: "trimSnaps",
				breakpoints: {
					"(min-width: 768px)": { dragFree: true },
				},
			});

			// Render charts now that Embla exists
			setTimeout(renderCharts, 0);
		},
		prev() {
			this.embla?.scrollPrev();
		},
		next() {
			this.embla?.scrollNext();
		},
	};
}
