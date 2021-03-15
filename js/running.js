// ? Running child class of the workout class

class Running extends Workout {
    constructor(coords, distance, duration, cadence){
        super(coords, distance, duration);
        // ? Cadence - Total number of steps takes per minutes while running
        this.cadence = cadence; 
        this.type = "Running"
        this.calcPace();
        this._setDescription();
    }

    calcPace(){
        // ? Pace - Number of minutes to cover a miles or kilometer
        //  * min/km
        this.pace = this.duration / this.distance;
        return this.pace;
    }


}