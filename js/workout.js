// ? Workout parent class

class Workout {
    constructor(coords, distance, duration){
        this.id = Date.now().toString().split(-10);
        this.coords = coords; // [lng, lat]
        this.distance = distance;
        this.duration = duration;
        this.date = new Date();

    }
}