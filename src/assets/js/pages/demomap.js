"use strict";

document.addEventListener("DOMContentLoaded", init);

function moveAndUpdate() {
    applyRandomMovement();
    updateShuttles();
}

function init() {
   createMap();
   setInterval(moveAndUpdate, 50);
}

function createMap() {
    const map = new ol.Map({
        target: 'centra-map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.TileJSON({
                    url: 'https://api.maptiler.com/maps/basic-v2/256/tiles.json?key=v7RhHG7ZxC29bKCh6207',
                    tileSize: 256
                })
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([4.34878, 50.85045]),
            zoom: 4
        })
    });

    const coloniesLayer = createColoniesLayer();
    const shuttlesLayer = createShuttlesLayer();
    const tracksLayer = createTracksLayer();
    map.addLayer(coloniesLayer);
    map.addLayer(shuttlesLayer);
    map.addLayer(tracksLayer);

    return map;
}

function createColoniesLayer() {
    return new ol.layer.Vector({
        source: new ol.source.Vector({
            url: 'assets/js/colonies.geojson',
            format: new ol.format.GeoJSON()
        }),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: 'assets/images/generic_marker.png',
                tileSize: 256,
                scale: 0.008
            })
        }),
    });
}

const shuttles = [
    "AE6-C72-EFA",
    "ADD-BB2-47D"
];

const locShuttles = {
    "AE6-C72-EFA": [106.8478695, -6.1568562],
    "ADD-BB2-47D": [56.8478695, -6.1568562]
};


const ftShuttles = {};
function createShuttleSource() {
    return new ol.source.Vector({
        features: shuttles.map(shuttle => ftShuttles[shuttle])
    });
}
function createShuttlesLayer() {
    for (const shuttle of shuttles) {
        ftShuttles[shuttle] = new ol.Feature(
            new ol.geom.Point(
                ol.proj.fromLonLat(locShuttles[shuttle])
            )
        );
    }

    return new ol.layer.Vector({
        source: createShuttleSource(),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: 'assets/images/generic_marker.png',
                tileSize: 256,
                scale: 0.008
            })
        }),
    });
}


function applyRandomMovement() {
    shuttles.forEach(shuttle => {
        locShuttles[shuttle][0] += Math.random()*2-1;
        locShuttles[shuttle][1] += Math.random()*2-1;
    })
}

function updateShuttles() {
    for (const shuttle of shuttles) {
        ftShuttles[shuttle].getGeometry().setCoordinates(
            ol.proj.fromLonLat(locShuttles[shuttle])
        );
    }
}


function createTracksLayer() {
    return new ol.layer.Vector({
        source: new ol.source.Vector({
            url: 'assets/js/tracks.geojson',
            format: new ol.format.GeoJSON()
        }),
        style: new ol.style.Style({
          fill: new ol.style.Fill({ color: '#FF0000', weight: 4}),
          stroke: new ol.style.Stroke({ color: '#FF0000', weight: 2})
        })
    });
}