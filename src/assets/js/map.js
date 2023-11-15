"use strict";

document.addEventListener("DOMContentLoaded",init);

function init() {
    createMap();
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
            center: ol.proj.fromLonLat([4.34878,50.85045]),
            zoom: 8
        
        })
    });

    const colonies = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: 'assets/js/colonies.geojson',
            format: new ol.format.GeoJSON()
        }),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: 'assets/images/location_map_icon.png',
                tileSize: 256,
                scale: 0.008
            })
        })
    });

    
    map.addLayer(colonies);

    return map;
}

