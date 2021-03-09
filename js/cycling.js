// ? Cycling child class of the workout class

class Cycling extends Workout {
    constructor(coords, distance, duration, elevGain){
        super(coords, distance, duration);
        this.elevGain = elevGain;
        this.calcElevGain();
    }

    calcElevGain(){
        // * km/h
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}