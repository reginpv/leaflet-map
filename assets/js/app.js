const LOCATIONS = [
  {
    label: "a",
    center: [14.78708, 120.88335],
    marker: [14.82749, 120.88414],
    zoom: 13
  }, 
  {
    label: "b",
    center: [14.53424, 121.02156],
    marker: [14.55381, 121.01912],
    zoom: 13
  },
  {
    label: "init",
    center: [9.796, 122.080],
    zoom: 6
  }
]

// Get default
const init = LOCATIONS.filter(loc=>loc.label=="init")[0]
var mapOptions = {
  center: init.center,
  zoom: init.zoom
}

// Map init + Layer
var map = new L.map('map', mapOptions)
var layer = new L.TileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png')
map.addLayer(layer)

// Create markers
LOCATIONS.forEach(loc=>{

  if(loc.marker) {
    let marker = L.marker(loc.marker)
    marker.addTo(map)
  }

})

// Map view updater
function updateMap(term) {

  const activeView = LOCATIONS.filter(loc=>loc.label==term)
  console.log(term, activeView)

  if(activeView.length>0) {
    map.setView(activeView[0].center, activeView[0].zoom)
  } else {
    map.setView(mapOptions.center, mapOptions.zoom)
  }

}