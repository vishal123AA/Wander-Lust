 const map = new mapboxgl.Map({
    accessToken: mapToken,
    container: 'map', // container ID
    style : "mapbox://styles/mapbox/streets-v12",//style url
    center: [-71.06776, 42.35816], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
 });