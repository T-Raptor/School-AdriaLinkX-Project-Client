const MARKER_TRACK_SELECTED_STYLE = new ol.style.Style({
    fill: new ol.style.Fill({ color: "#00ff00" }),
    stroke: new ol.style.Stroke({ color: "#00ff00", width: 4 })
});


function trackFeatureToEntity(map, feature) {
    for(const entity of map.entities.tracks) {
        if (entity.feature === feature) {
            return entity;
        }
    }
    return null;
}

function createRoutePicker(map) {
    const routePicker = {map: map, selection: []};
    map.olMap.on("click", function(e) {
        map.olMap.forEachFeatureAtPixel(e.pixel, function (feat, layer) {
            if (map.lyrTracks === layer) {
                const entity = trackFeatureToEntity(map, feat);
                if (entity.selected) {
                    entity.selected = false;
                    feat.setStyle();
                } else {
                    entity.selected = true;
                    feat.setStyle(MARKER_TRACK_SELECTED_STYLE);
                }
            }
        });
    });
    return routePicker;
}

function exportRouteSelection(map) {
    return map.entities.tracks.filter(ent => ent.selected).map(ent => ent.name);
}

export { createRoutePicker, exportRouteSelection };
