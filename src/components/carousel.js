import EmblaCarousel from "embla-carousel";

const mainEmbla = EmblaCarousel(
	document.querySelector(".embla--main .embla__viewport"),
	{ containScroll: "trimSnaps" },
);

const thumbEmbla = EmblaCarousel(
	document.querySelector(".embla--thumb .embla__viewport"),
	{ containScroll: "keepSnaps", dragFree: true },
);

const thumbs = document.querySelectorAll(".embla--thumb .embla__slide");

mainEmbla.on("select", () => {
	const idx = mainEmbla.selectedScrollSnap();
	thumbs.forEach((t, i) => t.classList.toggle("is-selected", i === idx));
	thumbEmbla.scrollTo(idx);
});

thumbs.forEach((thumb, index) => {
	thumb.addEventListener("click", () => {
		mainEmbla.scrollTo(index);
	});
});
