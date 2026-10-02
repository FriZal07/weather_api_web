import "./style.css";
import ui_load from "./ui.js";
import { ui_update_weather_location } from "./ui.js";
import { get_weather_data_api } from "./ui.js";
import { ui_update_weather } from "./ui.js";

ui_load();
ui_update_weather_location();
ui_update_weather(await get_weather_data_api("London"));