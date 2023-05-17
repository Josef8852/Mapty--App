'use strict';


let select = document.querySelector('#select');

let clicked = document.querySelector('.clicked');

let distance = document.querySelector('.distance');

let duration = document.querySelector('.duration');

let rate = document.querySelector('.rate');

let list = document.querySelector('.list');

let form = document.querySelector('.form');


let box = document.querySelectorAll('.box');

let deleteWorkouts = document.querySelector('.delete');


let markers = new Array();

let map, mapEvent;

/* Geolocation */


form.style.display = 'none';
deleteWorkouts.style.display = 'none';


if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(/* success */(position) => {

    const latitude = position.coords.latitude;

    const longitude = position.coords.longitude;

    const coords = [latitude, longitude];

    /* Third party library */

    map = L.map('map').setView(coords, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    }).addTo(map);

    map.on('click', (event) => {
      mapEvent = event;
      form.style.display = 'flex';
      deleteWorkouts.style.display = 'block';
      distance.focus();
    });



  }, /* error */() => {

    alert('Could not get your position');
  })
};








/* Functions */




let getDate = () => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const date = new Date();

  let day = String(date.getDate()).padStart(2, '0');

  let month = monthNames[date.getMonth()];

  let array = [day, month];

  return array;
}


let clear = () => {
  duration.value = '';
  rate.value = '';
  distance.value = '';
}

let insert = (type, array, km, dur, cadence) => {
  let running = `<div class="box ${type}">
  <h2>${type.charAt(0).toUpperCase() + type.slice(1)} on ${array[1]} ${array[0]}</h2>
  <p>
    <span class="km">🏃‍♂️ ${km} KM</span>
    <span class="min">⏱ ${dur} MIN</span>
    <span class="min-km">⚡️ ${Math.ceil(km / dur)} KM/MIN</span>
    <span class="spm">🦶🏼 ${cadence} SPM</span>
  </p>
</div>`

  list.insertAdjacentHTML('afterbegin', running);
  clear();
};





/* Form */


select.addEventListener('change', () => {
  if (select.value === 'cycling') {
    rate.placeholder = 'meters';
  }
  else {
    rate.placeholder = 'step/min';
  }
})


clicked.addEventListener('click', (e) => {
  e.preventDefault();

  let myDate = getDate();

  let km = Number(Math.abs(distance.value));

  let dur = Number(Math.abs(duration.value));

  let cadence = Number(Math.abs(rate.value));


  if (distance.value && duration.value && rate.value) {
    insert(select.value, myDate, km, dur, cadence);
    const { lat, lng } = mapEvent.latlng

    let mark = L.marker([lat, lng]).addTo(map)
      .bindPopup(L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeButton: true,
        closeOnClick: false,
        className: `${select.value}-pop`

      })).setPopupContent(`<p>${select.value.charAt(0).toUpperCase() + select.value.slice(1)} on ${myDate[1]} ${myDate[0]}</p>`)
      .openPopup();

    markers.push(mark);


    box = document.querySelectorAll('.box');
  }



});


deleteWorkouts.addEventListener('click', () => {
  box.forEach((element) => {
    element.style.display = 'none';
  });


  for (let i = 0; i < markers.length; i++) {
    map.removeLayer(markers[i]);
  }

});







