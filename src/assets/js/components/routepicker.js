const MARKER_TRACK_SELECTED_STYLE = new ol.style.Style({
    fill: new ol.style.Fill({ color: "#00ff00", weight: 40}),
    stroke: new ol.style.Stroke({ color: "#00ff00", weight: 40, width: 4})
});

function createRoutePicker(map) {
    const routePicker = {map: map, selection: []};
    map.olMap.on("click", function(e) {
        map.olMap.forEachFeatureAtPixel(e.pixel, function (feat, layer) {
            if (map.lyrTracks === layer) {
                feat.setStyle(MARKER_TRACK_SELECTED_STYLE);
            }
        });
    });
    return routePicker;
}

export { createRoutePicker };
