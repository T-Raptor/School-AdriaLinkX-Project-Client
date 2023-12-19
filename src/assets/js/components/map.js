"use strict";
import { getStations, getTracks } from "../api.js";


const MAP_TILES_URL = 'https://api.maptiler.com/maps/basic-v2/256/tiles.json?key=v7RhHG7ZxC29bKCh6207';
const MAP_VIEW_CENTER = ol.proj.fromLonLat([4.34878, 50.85045]);
const MAP_VIEW_ZOOM = 4;


const MARKER_STATION_SRC = 'assets/images/generic_marker.png';
const LAYER_STATIONS_STYLE =
new ol.style.Style({
    image: new ol.style.Icon({
        src: MARKER_STATION_SRC,
        tileSize: 256,
        scale: 0.008
    })
});

const MARKER_SHUTTLE_SRC = 'assets/images/green_marker.png';
const LAYER_SHUTTLES_STYLE =
new ol.style.Style({
    image: new ol.style.Icon({
        src: MARKER_SHUTTLE_SRC,
        tileSize: 256,
        scale: 0.008
    })
});

const MARKER_WARNING_SRC = 'assets/images/warning.png';
const LAYER_WARNINGS_STYLE =
new ol.style.Style({
    image: new ol.style.Icon({
        src: MARKER_WARNING_SRC,
        tileSize: 256,
        scale: 0.35
    })
});

const MARKER_BREAK_SRC = 'assets/images/break.png';
const LAYER_BREAKS_STYLE =
new ol.style.Style({
    image: new ol.style.Icon({
        src: MARKER_BREAK_SRC,
        tileSize: 256,
        scale: 0.30
    })
});

const MARKER_TRACK_COLOR = '#FF0000';
const LAYER_TRACKS_STYLE =
new ol.style.Style({
    stroke: new ol.style.Stroke({ color: MARKER_TRACK_COLOR, width: 4})
});


function createMap(idTarget) {
    const olMap = createOlMap(idTarget);
    const lyrStations   = createVectorLayer(LAYER_STATIONS_STYLE);
    const lyrShuttles   = createVectorLayer(LAYER_SHUTTLES_STYLE);
    const lyrTracks     = createVectorLayer(LAYER_TRACKS_STYLE);
    const lyrWarnings   = createVectorLayer(LAYER_WARNINGS_STYLE);
    const lyrBreaks     = createVectorLayer(LAYER_BREAKS_STYLE);
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
        "lyrBreaks": lyrBreaks,
        "entities": {
            stations: [],
            shuttles: [],
            tracks: [],
            warnings: [],
            breaks: []
        }
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

function createVectorLayer(style) {
    return new ol.layer.Vector({
        source: createVectorSource(),
        style: style,
    });
}


function drawStation(map, name, location) {
    const feature = new ol.Feature(
        new ol.geom.Point(
            ol.proj.fromLonLat(location)
        )
    );
    map.lyrStations.getSource().addFeature(feature);
    const entity = { name: name, feature: feature };
    map.entities.stations.push(entity);
    return entity;
}

function drawShuttle(map, name, location) {
    const feature = new ol.Feature(
        new ol.geom.Point(
            ol.proj.fromLonLat(location)
        )
    );
    map.lyrShuttles.getSource().addFeature(feature);
    const entity = { name: name, feature: feature };
    map.entities.shuttles.push(entity);
    return entity;
}

function drawTrack(map, station1, station2, name) {
    const feature = new ol.Feature(
        new ol.geom.LineString([
            station1.feature.getGeometry().getCoordinates(),
            station2.feature.getGeometry().getCoordinates()
        ])
    );
    map.lyrTracks.getSource().addFeature(feature);
    const entity = {station1: station1, station2: station2, feature: feature, name: name};
    map.entities.tracks.push(entity);
    return entity;
}

function drawWarning(map, name, location) {
    const feature = new ol.Feature(
        new ol.geom.Point(
            ol.proj.fromLonLat(location)
        )
    );
    map.lyrWarnings.getSource().addFeature(feature);
    const entity = { name: name, feature: feature };
    map.entities.warnings.push(entity);
    return entity;
}

function drawBreak(map, name, location) {
    const feature = new ol.Feature(
        new ol.geom.Point(
            ol.proj.fromLonLat(location)
        )
    );
    map.lyrBreaks.getSource().addFeature(feature);
    const entity = { name: name, feature: feature };
    map.entities.breaks.push(entity);
    return entity;
}


function updateShuttle(shuttle, location) {
    shuttle.feature.getGeometry().setCoordinates(
        ol.proj.fromLonLat(location)
    );
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
            drawTrack(map, entStation1, entStation2, track.id);
        }
    });
}

function fetchAndDrawStationsAndTracks(map) {
    fetchAndDrawStations(map, fetchAndDrawTracks);
}

function getEntity(map, type, name) {
    const entities = map.entities[type];
    for (const entity of entities) {
        if (entity.name === name) {
            return entity;
        }
    }
    return null;
}


function setTrackStyle(map, trackId, style) {
    const entity = getEntity(map, "tracks", trackId);
    entity.feature.setStyle(style);
}



export {createMap, drawStation, drawShuttle, updateShuttle, drawTrack, fetchAndDrawStationsAndTracks, drawWarning, drawBreak, getEntity, setTrackStyle};
