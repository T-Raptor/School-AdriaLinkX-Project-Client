"use strict";
import { getStations, getTracks } from "../api.js";

const MAP_TILES_URL = 'https://api.maptiler.com/maps/basic-v2/256/tiles.json?key=v7RhHG7ZxC29bKCh6207';
const MAP_VIEW_CENTER = ol.proj.fromLonLat([4.34878, 50.85045]);
const MAP_VIEW_ZOOM = 4;

const MARKER_STATION_SRC = 'assets/images/generic_marker.png';
const MARKER_SHUTTLE_SRC = 'assets/images/green_marker.png';
const MARKER_TRACK_COLOR = '#FF0000';
const MARKER_WARNING_SRC = 'assets/images/warning.png';
const MARKER_BREAK_SRC = 'assets/images/break.png';


function createMap(idTarget) {
    const olMap = createOlMap(idTarget);
    const lyrStations = createStationsLayer();
    const lyrShuttles = createShuttlesLayer();
    const lyrTracks = createTracksLayer();
    const lyrWarnings = createWarningsLayer();
    const lyrBreaks = createBreaksLayer();
    olMap.addLayer(lyrStations);
    olMap.addLayer(lyrShuttles);
    olMap.addLayer(lyrTracks);
    olMap.addLayer(lyrWarnings);
    olMap.addLayer(lyrBreaks);
    return {
        "olMap": olMap,
        "lyrStations": lyrStations,
        "lyrShuttles": lyrShuttles,
        "lyrTracks": lyrTracks,
        "lyrWarnings": lyrWarnings,
        "lyrBreaks": lyrBreaks
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

function createWarningsLayer() {
    return new ol.layer.Vector({
        source: createVectorSource(),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: MARKER_WARNING_SRC,
                tileSize: 256,
                scale: 0.35
            })
        }),
    });
}

function createBreaksLayer() {
    return new ol.layer.Vector({
        source: createVectorSource(),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: MARKER_BREAK_SRC,
                tileSize: 256,
                scale: 0.25
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
    return {
        "name": name,
        "feature": feature
    };
}

function drawShuttle(map, name, location) {
    const feature = new ol.Feature(
        new ol.geom.Point(
            ol.proj.fromLonLat(location)
        )
    );
    map.lyrShuttles.getSource().addFeature(feature);
    return {
        "name": name,
        "feature": feature
    };
}

function updateShuttle(shuttle, location) {
    shuttle.feature.getGeometry().setCoordinates(
        ol.proj.fromLonLat(location)
    );
}

function drawTrack(map, station1, station2) {
    const feature = new ol.Feature(
        new ol.geom.LineString([
            station1.feature.getGeometry().getCoordinates(),
            station2.feature.getGeometry().getCoordinates()
        ])
    );
    map.lyrTracks.getSource().addFeature(feature);
    return {
        "station1": station1,
        "station2": station2,
        "feature": feature
    };
}

function drawWarning(map, name, location) {
    const feature = new ol.Feature(
        new ol.geom.Point(
            ol.proj.fromLonLat(location)
        )
    );
    map.lyrWarnings.getSource().addFeature(feature);
    return {
        "name": name,
        "feature": feature
    };
}

function drawBreak(map, name, location) {
    const feature = new ol.Feature(
        new ol.geom.Point(
            ol.proj.fromLonLat(location)
        )
    );
    map.lyrBreaks.getSource().addFeature(feature);
    return {
        "name": name,
        "feature": feature
    };
}


function fetchAndDrawStations(map, successHandler) {
    getStations((stations) => {
        const entStations = {};
        for (const station of stations) {
            entStations[station.name] = drawStation(map, station.name, [station.longitude, station.latitude]);
        }
        successHandler(map, entStations);
    });
}

function fetchAndDrawTracks(map, entStations) {
    getTracks((tracks) => {
        for (const track of tracks) {
            const entStation1 = entStations[track.station1.name];
            const entStation2 = entStations[track.station2.name];
            drawTrack(map, entStation1, entStation2);
        }
    });
}

function fetchAndDrawStationsAndTracks(map) {
    fetchAndDrawStations(map, fetchAndDrawTracks);
}



export {createMap, drawStation, drawShuttle, updateShuttle, drawTrack, fetchAndDrawStationsAndTracks, drawWarning, drawBreak};
