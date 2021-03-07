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

let map, mapEvent;
let lngLat;

navigator.geolocation.getCurrentPosition(
  function (position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

    mapboxgl.accessToken =
      "pk.eyJ1IjoianNkZXZlbG9wZXIiLCJhIjoiY2tpemxnYnlxMmlrMzJ4c2N6cTQ0cnVxZyJ9.GSz0IUv_9wcuy5Yqwv8ldA";
    const coords = [longitude, latitude];
    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
      center: coords, // starting position [lng, lat]
      zoom: 15, // starting zoom
    });


    createMarker(coords, 'you are here!');

    // Handling click on map event
    map.on("click", function (e) {
      mapEvent = e;
      form.classList.remove("hidden");
      inputDistance.focus();
      lngLat = e.lngLat;        // mapbox using it in reverse lng first 
      // let { lng, lat } = e.lngLat;
      // createMarker([lng, lat], 'workout');
      console.log(e.lngLat);
    });
  },
  function () {
    alert("Didn't work");
  }
);

// ? Create marker function
function createMarker(coords, message) {
  var marker = new mapboxgl.Marker().setLngLat(coords).addTo(map);

  var popup = new mapboxgl.Popup({
    closeOnClick: false,
    anchor: "bottom",
    offset: 16
    // className: 'running-popup'
  })
    .setLngLat(coords)
    .setHTML(`<h3>${message}</h3>`)
    .addTo(map);

    // popup.removeClassName('mapboxgl-popup-content');
    // popup.addClassName('running-popup');
}


// ? Handling form submit event

form.addEventListener("submit", function(e){
  e.preventDefault();
  let {lng, lat } = lngLat;
  createMarker([lng, lat], 'workout');

  inputDistance.value = inputDuration.value = '';
  inputCadence.value = inputElevation.value = '';

})

// ? Handling change event trigger on select form type input

inputType.addEventListener("change", function(){
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
})
