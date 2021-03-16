"use strict";

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

// let map, mapEvent;
// let lngLat;

// MAIN CLASS

class App {
  #map;
  #mapEvent;
  #lngLat;

  constructor() {
    this._getCurrentLocation();
    form.addEventListener("submit", this._submitForm.bind(this));
    inputType.addEventListener("change", this._toggleformFields);
    containerWorkouts.addEventListener("click", this._moveMapToPosition.bind(this));
    this.workout;
    this.workouts = [];
    this.mapZoomLevel =  15;
  }

  // get current location
  _getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert("Didn't get the location");
      }
    );
  }

  // ? Load Map after fetching location

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    // console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

    mapboxgl.accessToken = api.API_KEY; // integrate mapbox api key

    const coords = [longitude, latitude];
    this.#map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
      center: coords, // starting position [lng, lat]
      zoom: this.mapZoomLevel, // starting zoom
    });

    this._createMarker(coords, "you are here!");

    // Handling click on map event
    this.#map.on("click", this._showForm.bind(this));
  }

  // ? Create marker function
  _createMarker(coords, message) {
    var marker = new mapboxgl.Marker().setLngLat(coords).addTo(this.#map);
    let sign = `${this.workout && this.workout.type === "Running" ? '🏃‍♂️' : '🚴‍♀️'}`

    var popup = new mapboxgl.Popup({
      closeOnClick: false,
      anchor: "bottom",
      offset: 16,
      // className:
    })
      .setLngLat(coords)
      .setHTML(`<h3> ${sign} ${message}</h3>`)
      .addTo(this.#map);
  }

  // ? show form on click on map

  _showForm(e) {
    this.#mapEvent = e;
    form.classList.remove("hidden");
    inputDistance.focus();
    this.#lngLat = e.lngLat; // mapbox using it in reverse lng first
    // let { lng, lat } = e.lngLat;
    // createMarker([lng, lat], 'workout');
    console.log(e.lngLat);
  }

  // ? hide form
  _hideForm(){
    inputDistance.value = inputDuration.value = "";
    inputCadence.value = inputElevation.value = "";
    form.classList.add("hidden");
  }

  // ? handle form toggle fields
  _toggleformFields() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _checkValidNumber(...numbers) {
    let output = numbers.every((value) => {
      return Number.isFinite(value);
    });

    return output;
  }

  _checkPositiveNumber(...numbers) {
    let output = numbers.every((value) => {
      return value > 0;
    });

    return output;
  }

  _renderWorkoutList(workout) {
    let html = `
      <li class="workout workout--${workout.type.toLowerCase()}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.description}</h2>
      <div class="workout__details">
        <span class="workout__icon">🏃‍♂️</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
    `;

    if (workout.type === "Running") {
      html += `
        <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.pace.toFixed(1)}</span>
        <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${workout.cadence}</span>
        <span class="workout__unit">spm</span>
        </div>
     </li>
      `;
    }

    if (workout.type === "Cycling") {
      html += `
      <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.speed.toFixed(1)}</span>
      <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${workout.elevGain}</span>
      <span class="workout__unit">m</span>
     </div>
  </li> 
      `;
    }

    form.insertAdjacentHTML("afterend", html);
  }

  // ? Submit form / or create new workout
  _submitForm(e) {
    e.preventDefault();
    let { lng, lat } = this.#lngLat;

    // * Fetch the form values
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    console.log(type);
    // * if workout is running, create running workout
    if (type === "running") {
      const cadence = +inputCadence.value;
      let isNumber = this._checkValidNumber(distance, duration, cadence);
      let isPositive = this._checkPositiveNumber(distance, duration, cadence);

      if (!isNumber || !isPositive) {
        alert("Please enter correct values");
      } else {
        this.workout = new Running([lng, lat], distance, duration, cadence);
      }
    }

    // * if workout is cycling, create cycling workout
    if (type === "cycling") {
      const elevGain = +inputElevation.value;
      let isNumber = this._checkValidNumber(distance, duration, elevGain);
      let isPositive = this._checkPositiveNumber(distance, duration);

      if (!isNumber || !isPositive) {
        alert("Please enter correct values");
      } else {
        this.workout = new Cycling([lng, lat], distance, duration, elevGain);
      }
    }

    console.log("workout", this.workout);
    // * Create the marker on map
    this._createMarker([lng, lat], `${this.workout.type}`);
    // (this.workout === undefined || this.workout.type === "Running") ? "workout--running" : "workout--cycling"

    this.workouts.push(this.workout);

    this._renderWorkoutList(this.workout);

    this._hideForm();

   
  }

  _moveMapToPosition(e){
    let workOutEl = e.target.closest(".workout");
    
    console.log(this.workouts);

    let workout = this.workouts.find(work => {
      return work.id == workOutEl.dataset.id
    });

    if(workout){
      this.#map.flyTo({
        center: workout.coords, essential: true
      });
    }
    
  }
}

const app = new App();
