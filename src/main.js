import Alpine from "alpinejs";
import { playerSelectionComponent } from "./ui/playerSelection.js";
import { playerDisplayComponent } from "./ui/playerDisplay.js";
import { filterComponent } from "./filters/filterComponent.js";
import { initStore, setSelectedPlayer } from "./state/store.js";
import { renderCharts } from "./charts/controller.js";
import "./components/carousel.js";

// Pre-init player value
initStore({ selected: "Buddy Hield" });

// Register Alpine Components
window.Alpine = Alpine;
Alpine.data("playerSelection", playerSelectionComponent);
Alpine.data("playerDisplay", playerDisplayComponent);
Alpine.data("filterComponent", filterComponent);

// Select Player logic
window.selectPlayer = (player) => {
	setSelectedPlayer(player.name);
	renderCharts(`data/${player.data}-Shotdata.csv`);
};

renderCharts("data/Buddy-Hield-Shotdata.csv");

Alpine.start();
