export class Forecast {
    // The constructor is called automatically when you create a new instance of the class
    constructor(date, temperature, icon, description) {

        this.date = date;
        this.temperature = temperature;
        this.icon = icon;
        this.description = description;
    }

    getSummary() {
        return `Forecast for ${this.date}: ${this.temperature}° and ${this.description}.`;
    }
}