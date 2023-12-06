"use strict";
const MAP_TILES_URL = 'https://api.maptiler.com/maps/basic-v2/256/tiles.json?key=v7RhHG7ZxC29bKCh6207';
const MAP_VIEW_CENTER = ol.proj.fromLonLat([4.34878, 50.85045]);
const MAP_VIEW_ZOOM = 4;

const MARKER_STATION_SRC = 'assets/images/generic_marker.png';
const MARKER_SHUTTLE_SRC = 'assets/images/green_marker.png';
const MARKER_TRACK_COLOR = '#FF0000';


function createMap(idTarget) {
    const olMap = createOlMap(idTarget);
    const lyrStations = createStationsLayer();
    const lyrShuttles = createShuttlesLayer();
    const lyrTracks = createTracksLayer();
    olMap.addLayer(lyrStations);
    olMap.addLayer(lyrShuttles);
    olMap.addLayer(lyrTracks);
    return {
        "olMap": olMap,
        "lyrStations": lyrStations,
        "lyrShuttles": lyrShuttles,
        "lyrTracks": lyrTracks
    };
}

function createOlMap(idTarget) {
    return new ol.Map({
        target: idTarget,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.TileJSON({
                    url: MAP_TILES_URL,
                    tileSize: 256
                })
            })
        ],
        view: new ol.View({
            center: MAP_VIEW_CENTER,
            zoom: MAP_VIEW_ZOOM
        })
    });
}

function createVectorSource() {
    return new ol.source.Vector({
        features: []
    });
}

function createStationsLayer() {
    return new ol.layer.Vector({
        source: createVectorSource(),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: MARKER_STATION_SRC,
                tileSize: 256,
                scale: 0.008
            })
        }),
    });
}

function createShuttlesLayer() {
    return new ol.layer.Vector({
        source: createVectorSource(),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: MARKER_SHUTTLE_SRC,
                tileSize: 256,
                scale: 0.008
            })
        }),
    });
}

function createTracksLayer() {
    return new ol.layer.Vector({
        source: createVectorSource(),
        style: new ol.style.Style({
          fill: new ol.style.Fill({ color: MARKER_TRACK_COLOR, weight: 4}),
          stroke: new ol.style.Stroke({ color: MARKER_TRACK_COLOR, weight: 2})
        })
    });
}


function drawStation(map, name, location) {
    const feature = new ol.Feature(
        new ol.geom.Point(
            ol.proj.fromLonLat(location)
        )
    );
    map.lyrStations.getSource().addFeature(feature);
    return feature;
}

function drawShuttle(map, name, location) {
    const feature = new ol.Feature(
        new ol.geom.Point(
            ol.proj.fromLonLat(location)
        )
    );
    map.lyrShuttles.getSource().addFeature(feature);
    return feature;
}



export {createMap, drawStation, drawShuttle};
