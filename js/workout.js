// ? Workout parent class

class Workout {
    constructor(coords, distance, duration){
        this.id = Date.now().toString().split(-10);
        this.coords = coords; // [lng, lat]
        this.distance = distance;
        this.duration = duration;
        this.date = new Date();

    }

    _setDescription(){
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.description = `${this.type} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
        
    }
}