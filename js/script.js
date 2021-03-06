"use strict";

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const deleteButton = document.querySelector(".delete__workout");

// let map, mapEvent;
// let lngLat;

// MAIN CLASS

class App {
  constructor() {
    this.map;
    this._getCurrentLocation();
    form.addEventListener("submit", this._submitForm.bind(this));
    inputType.addEventListener("change", this._toggleformFields);
    containerWorkouts.addEventListener("click", this._moveMapToPosition.bind(this));
    // deleteButton.addEventListener("click", this._deleteWorkout.bind(this));
  
    this.workouts = [];
    this.mapZoomLevel = 14;
    this._getFromLocalStorage();
    this.lngLat;
    this.mapEvent;
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
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
      center: coords, // starting position [lng, lat]
      zoom: this.mapZoomLevel, // starting zoom
    });

    this._createMarker(coords, "You are here!", null);

    // Handling click on map event
    this.map.on("click", this._showForm.bind(this));

    if (this.workouts) {
      this.workouts.forEach((work) => {
        work.className = "marker";
        this._createMarker(work.coords, `${work.type}`, work.type);
      });
    }
  }

  // ? Create marker function
 // ? Create marker function
 _createMarker(coords, message, type) {
    
  let cycImage  = "https://cdn4.iconfinder.com/data/icons/baby-child-children-kids/100/baby-18-512.png";
  let runImage = "https://mpng.subpng.com/20180606/iko/kisspng-trail-running-computer-icons-sport-trail-running-5b17b38ff23611.3105823315282799519921.jpg";
  let nativeImage = "https://i.pinimg.com/originals/22/11/f8/2211f8cc5b35a7cd807586328bc33e35.png";

  var el = document.createElement("div");
  el.className = "marker";
  el.style.backgroundImage =`url(${(type === "Running") ? runImage : (type === null) ? nativeImage : cycImage})`;
  // el.style.background= "?????????????";

  el.style.width =  "40px";
  el.style.height = "40px";
  el.style.backgroundRepeat = "no-repeat";
  
  el.style.backgroundSize = "100%";

  var marker = new mapboxgl.Marker(el).setLngLat(coords).addTo(this.map);
  let sign = `${
    type === "Running" ? "?????????????" : "?????????????"
  }`;

  var popup = new mapboxgl.Popup({
    closeOnClick: false,
    anchor: "bottom",
    offset: 16,

    // className:
  })
    .setLngLat(coords)
    .setHTML(`<h3> ${sign} ${message}</h3>`)
    .addTo(this.map);
}

  // ? show form on click on map

  _showForm(e) {
    this.mapEvent = e;
    form.classList.remove("hidden");
    inputDistance.focus();
    this.lngLat = e.lngLat; // mapbox using it in reverse lng first
    // let { lng, lat } = e.lngLat;
    // createMarker([lng, lat], 'workout');
    console.log(e.lngLat);
  }

  // ? hide form
  _hideForm() {
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
      <li class="workout workout--${workout.type.toLowerCase()}" data-id="${ workout.id}">
      <span class="delete__workout">Remove workout</span>
      <h2 class="workout__title">${workout.description} </h2>
      <div class="workout__details">
        <span class="workout__icon">?????????????</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">???</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
    `;

    if (workout.type === "Running") {
      html += `
        <div class="workout__details">
        <span class="workout__icon">??????</span>
        <span class="workout__value">${workout.pace.toFixed(1)}</span>
        <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
        <span class="workout__icon">????????</span>
        <span class="workout__value">${workout.cadence}</span>
        <span class="workout__unit">spm</span>
        </div>
     </li>
      `;
    }

    if (workout.type === "Cycling") {
      html += `
      <div class="workout__details">
      <span class="workout__icon">??????</span>
      <span class="workout__value">${workout.speed.toFixed(1)}</span>
      <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
      <span class="workout__icon">???</span>
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
    let { lng, lat } = this.lngLat;

    // * Fetch the form values
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    
    // * if workout is running, create running workout
    if (type === "running") {
      const cadence = +inputCadence.value;
      let isNumber = this._checkValidNumber(distance, duration, cadence);
      let isPositive = this._checkPositiveNumber(distance, duration, cadence);

      if (!isNumber || !isPositive) {
        alert("Please enter correct values");
        return;
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
        return;
      } else {
        this.workout = new Cycling([lng, lat], distance, duration, elevGain);
      }
    }

    
    // * Create the marker on map
    this._createMarker([lng, lat], `${this.workout.type}`, this.workout.type);
    // (this.workout === undefined || this.workout.type === "Running") ? "workout--running" : "workout--cycling"

    this.workouts.push(this.workout);

    this._setToLocalStorage();

    this._renderWorkoutList(this.workout);

    this._hideForm();
  }

  _moveMapToPosition(e) {
     
    let workOutEl = e.target.closest(".workout");
    
    // console.log(this.workouts);
    if(e.target.classList[0] == "delete__workout"){
      
      let workouts = this.workouts.filter((work) => {
        
         if(work.id[0] !== workOutEl.dataset.id){
           return work;
         }
      });
     
      this.workouts = workouts;
      this._setToLocalStorage();
      this._getFromLocalStorage();
      location.reload();
    }else{
      let workout = this.workouts.find((work) => {
        return work.id == workOutEl.dataset.id;
      });
  
      if (workout) {
        this.map.flyTo({
          center: workout.coords,
          essential: true,
        });
      }
    }

    
  }

  
  _setToLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this.workouts));
  }

  _getFromLocalStorage() {
    let data = JSON.parse(localStorage.getItem("workouts"));

    if (!data) return;
    this.workouts = data;

    this.workouts.forEach((work) => {
      this._renderWorkoutList(work);
    });
  }
}

const app = new App();
