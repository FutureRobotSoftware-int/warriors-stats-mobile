import Alpine from "alpinejs";
import {
	playerDisplay,
	playerSelection,
	getFilters,
} from "./alpine/playersData.js";
import { renderCharts } from "./charts/charts.js";
import "./embla/carousel.js";
import "./alpine/storage.js";

window.playerDisplay = playerDisplay;
window.playerSelection = playerSelection;
window.getFilters = getFilters;
window.renderCharts = renderCharts;

window.Alpine = Alpine;
Alpine.start();
