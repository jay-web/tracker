// ? Cycling child class of the workout class

class Cycling extends Workout {
    constructor(coords, distance, duration, elevGain){
        super(coords, distance, duration);
        // ?The elevation gain in cycling is the total amount you climb in a ride. 
        // ? If you climb 1000 feet and descent 500 feet and again climb 300 feet, 
        // ? your elevation gain during the ride is 1300 feet.
        this.elevGain = elevGain;
        this.type = "Cycling"
        this.calcSpeed();
        this._setDescription();
    }

    calcSpeed(){
        // * km/h
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}