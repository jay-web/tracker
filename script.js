"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
      zoom: 15, // starting zoom
    });

    this._createMarker(coords, "you are here!");

    // Handling click on map event
    this.#map.on("click", this._showForm.bind(this));
  }

  // ? Create marker function
  _createMarker(coords, message) {
    var marker = new mapboxgl.Marker().setLngLat(coords).addTo(this.#map);

    var popup = new mapboxgl.Popup({
      closeOnClick: false,
      anchor: "bottom",
      offset: 16,
      // className: 'running-popup'
    })
      .setLngLat(coords)
      .setHTML(`<h3>${message}</h3>`)
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

  // ? handle form toggle fields
  _toggleformFields() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  // ? Submit form / or create new workout
  _submitForm(e) {
    e.preventDefault();
    let { lng, lat } = this.#lngLat;
    this._createMarker([lng, lat], "workout");

    inputDistance.value = inputDuration.value = "";
    inputCadence.value = inputElevation.value = "";
  }
}

const app = new App();
