import logo from './powered_by_google_on_white_hdpi.png';

import './App.css';
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
var config = require('./config.js');
const key = config.key;

function App() {
  const [address, set_address] =  useState(undefined);
  const [state, set_state] =  useState(undefined);
  const [zip, set_zip] =  useState(undefined);
  const [coords, set_coords] = useState(undefined);
  const [establishments, set_establishments] = useState([]);

  useEffect(function() {
    let id;
let target;
let options;

function success(pos) {
  const crd = pos.coords;

  const g_coords = {
    lat: crd.latitude,
    lng: crd.longitude
  }
  set_coords(g_coords);
  console.log(g_coords);
  //navigator.geolocation.clearWatch(id);
}

function error(err) {
  console.error(`ERROR(${err.code}): ${err.message}`);
}


options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0
};

id = navigator.geolocation.watchPosition(success, error, options);

  }, []);


  useEffect(function() {
    if (coords) {

        notify();
    }

  }, [coords])

  const notify = function () {

    if (window.google) {
      if (zip && state && address) {

      var request = {
    query: `${address} ${state}, ${zip}`,
    fields: ["name", "formatted_address", "place_id", "geometry"],
  };
      var service = new window.google.maps.places.PlacesService(document.createElement('div'));

      service.findPlaceFromQuery(request, function(results, status) {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            console.log(results[i].geometry.location.lat());
            service.nearbySearch({
                location: {
                lat:results[i].geometry.location.lat(),
                lng: results[i].geometry.location.lng()
                },
                radius: 60
            }, function (place, status) {
                const nearby = place.filter((place) => place?.business_status)
                set_establishments(nearby);
                nearby.forEach((place) => toast(place.name + " is nearby!"));
            });
            
            console.log((results[i]));
          }
        }
      });
      } else if (coords) {
          var service = new window.google.maps.places.PlacesService(document.createElement('div'));

            service.nearbySearch({
                location: coords,
                radius: 40
            }, function (place, status) {
                console.log(place);
                const nearby = place.filter((place) => place?.business_status)
                set_establishments(nearby);
                nearby.forEach((place) => toast(place.name + " is nearby!"));
            });
      }
    }

  }
/*  const rendered_establishments = establishments.length > 0 ? establishments.map((establishment, key) => 
    <li key={key}>{establishment.name}</li>
  ) : "";*/
  return (
    <div className="App">
    <h1 className="text-3xl pb-10">Set your current address</h1>
    <ToastContainer />
    <img src={logo} className="" />
     <div className="flex justify-center">
  <div className="mb-3 xl:w-96">
    {!coords ? <div className="input-group relative flex flex-wrap items-stretch w-full mb-4">
      <input type="search" className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="address" aria-label="Search" aria-describedby="button-addon2" onChange={(event) => set_address(event.target.value)} />
      <input type="search" className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="state" aria-label="Search" aria-describedby="button-addon2" onChange={(event) => set_state(event.target.value)} />
      <input type="search" className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="zip" aria-label="Search" aria-describedby="button-addon2" onChange={(event) => set_zip(event.target.value)} />
      <button className="btn inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center" type="button" id="button-addon2" onClick={() => notify()}>
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" className="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
        </svg>
      </button>
    </div> : <h3 className="text-2xl bg-red-600 p-5 mt-10">Using GPS</h3>}
  </div>
</div>
    {/*<div>
    <ul>{rendered_establishments}</ul>
    </div>*/}
    </div>
  );
}

export default App;
