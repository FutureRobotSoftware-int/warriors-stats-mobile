import Alpine from "alpinejs";

// Global Alpine state for section switching
document.addEventListener("alpine:init", () => {
	Alpine.store("tab", "resume");
	Alpine.store("filters", {});
	Alpine.store("selected", "Buddy Hield");
});
