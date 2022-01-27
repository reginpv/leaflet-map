/** ------------------------------------------------------------------------------*/

const VIEWS = [
  {
    label: "a",
    center: [51.80540, -0.79799],
    zoom: 17
  },
  {
    label: "init",
    name: "All",
    center: [51.2946, -0.0302],
    zoom: 9
  }
]

/** ------------------------------------------------------------------------------*/

const LOCATIONS = [
  {
    name: "Aylesbury",
    group: "a",
    marker: [51.80674, -0.79813],
    markerPopup: "St Leonards Home Care",
    cardDetails: {
      title: "St Leonards Home Care",
      details: "Ideally situated within one mile of the town centre, St Leonards Care Home in Aylesbury is purpose-built across two floors. The home boasts several lounge areas, a courtyard-style outdoor living space, as well as a dedicated dementia care suite.",
      link: "#",
      image: {
        src: "assets/images/st-leonards.jpeg",
        alt: "St Leonards Home Care",
      },
      address: {
        add1: "Wendover Road",
        add2: "Aylesbury",
        add3: "HP21 9NJ"
      },
      email: "stleonards@bmcare.co.uk",
      phone: "01296 537243"
    },
  }, 
  {
    name: "Barnet",
    group: "b",
    marker: [51.67808,-0.18830],
    markerPopup: "Greenhill Care Home",
    cardDetails: {
      title: "Greenhill Care Home",
      details: "Greenhill Care Home in Barnet is a former private country house set within seven acres of beautiful mature grounds close to Hadley Wood's exclusive community. Having retained many of its original features, the home boasts an opulent setting complete with a dedicated dementia suite.",
      link: "#",
      image: {
        src: "assets/images/greenhill-care-home.jpeg",
        alt: "Greenhill Care Home",
      },
      address: {
        add1: "Waggon Road",
        add2: "Barnet",
        add3: "EN4 0PH"
      },
      email: "greenhill@bmcare.co.uk",
      phone: "0208 016 3548"
    },
  }, 
  {
    name: "Beaconsfield",
    group: "b",
    marker: [51.62280,-0.65673],
    markerPopup: "Bury Lodge Care Home",
    cardDetails: {
      title: "Bury Lodge Care Home",
      details: "Situated on Penn Road in the village of Knotty Green, Bury Lodge Care Home in Beaconsfield boasts an intimate purpose-built design and an interior that embodies a contemporary design and a flourishing lifestyle.",
      link: "#",
      image: {
        src: "assets/images/bury-lodge.jpeg",
        alt: "Bury Lodge Care Home",
      },
      address: {
        add1: "Penn Road",
        add2: "Beaconsfield",
        add3: "HP9 2TN"
      },
      email: "burylodge@bmcare.co.uk",
      phone: "01494 418466"
    },
  }, 
  {
    name: "Berkhamsted",
    group: "b",
    marker: [51.72784,-0.59594],
    markerPopup: "Ashlyns Care Home",
    cardDetails: {
      title: "Ashlyns Care Home",
      details: "Ashlyns Care Home in Berkhamsted is ideally situated in thirteen acres of parkland grounds on the historic Ashlyns Hall Estate. The home boasts an award-winning single storey, purpose-built design, complimented by a courtyard-inspired outdoor living space.",
      link: "#",
      image: {
        src: "assets/images/ashlyns.jpeg",
        alt: "Ashlyns Care Home",
      },
      address: {
        add1: "Chesham Road",
        add2: "Berkhamsted",
        add3: "HP4 2ST"
      },
      email: "ashlyns@bmcare.co.uk",
      phone: "01442 953065"
    },
  }, 
]


/** ------------------------------------------------------------------------------*/

// Elements
const card = document.querySelector("[data-details]")

// Get default
const init = VIEWS.filter(loc=>loc.label=="init")[0]
var mapOptions = {
  center: init.center,
  zoom: init.zoom,
}
var iconOptions = {
  iconUrl: "assets/images/marker.svg",
  iconSize: [60, 60],
}

// Map init + Layer
var map = new L.map('map', mapOptions)
var layer = new L.TileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png')
map.addLayer(layer)

generateMarkers()

// Map view updater
const mapButtons = document.querySelectorAll("[data-map]")

mapButtons.forEach(button=>{

  button.addEventListener('click', function(e){

    // Clean UI
    mapButtons.forEach(b=>b.classList.remove("map__active"))

    // Set vars
    let target = this
    let value = target.getAttribute("data-map")

    // Set active
    const activeView = VIEWS.filter(loc=>loc.label==value)

    // 
    // Update view
    // Logic for setting view per letter
    //
    // if(activeView.length>0) {
    //   map.setView(activeView[0].center, activeView[0].zoom)
    // } else {
    //   map.setView(mapOptions.center, mapOptions.zoom)
    // }

    map.setView(mapOptions.center, mapOptions.zoom)

    // Update ui
    target.classList.add("map__active")
    card.classList.add("map__hidden")

    // Filtered markers
    generateMarkers(value)

  })
})


/** ------------------------------------------------------------------------------*/

function generateMarkers(term = null){

  //console.log(markers)
  // Cleanup
  map.eachLayer((layer) => {
    console.log(layer)
    layer.remove()
  })

  // Re add map layer
  var layer = new L.TileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png')
  map.addLayer(layer)

  let locations = LOCATIONS
  if(term) {
    locations = locations.filter(loc=>loc.group==term)
    console.log(locations)
    
  }

  // Reupdate markers
  locations.forEach(loc=>{
    if(loc.marker) {
      let marker = L.marker(loc.marker, {
        icon: L.icon(iconOptions)
      })
      marker.addTo(map)
      if(loc.markerPopup) {
        // hiding popup for now (actual design do not have it, current site has)
        // marker.bindPopup(loc.markerPopup)
      }
  
      // Update ui card details
      marker.on('click', function(e){
  
        const cardData = LOCATIONS.filter(loc=>loc.marker[0]==e.latlng.lat)
  
        if(cardData.length>0) {
          const data = cardData[0]
          const el = {
            header: document.querySelector("[data-details='header']"),
            content: document.querySelector("[data-details='content']"),
            image: document.querySelector("[data-details='image']"),
            link: document.querySelector("[data-details='link']")
          }
          card.classList.remove("map__hidden")
          el.header.innerHTML = data.cardDetails.title
          el.content.innerHTML = data.cardDetails.details
          el.image.setAttribute('src', data.cardDetails.image.src)
          el.link.setAttribute('href', data.cardDetails.link)
          map.setView([data.marker[0] - .00300, data.marker[1] ], 16)
        } else {
          card.classList.add("map__hidden")
          el.header.innerHTML = ""
        }
  
      })
  
    }
  })

}