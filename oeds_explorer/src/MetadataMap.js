import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import L from 'leaflet';
import './MetadataTab.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

function MapComponent({ metadataOptions, selectedMetadata, mapZoomTrigger }) {
    const position = [50.775132, 6.083861];
    const [activeMetadata, setActiveMetadata] = useState([]);
    const mapRef = useRef(null);
    const geoJsonLayersRef = useRef([]);

    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    useEffect(() => {
        setActiveMetadata(selectedMetadata && selectedMetadata.concave_hull_geometry ? [selectedMetadata] : metadataOptions);
    }, [metadataOptions, selectedMetadata]);

    useEffect(() => {
        if (mapRef.current) {
            geoJsonLayersRef.current.forEach(layer => mapRef.current.removeLayer(layer));
            geoJsonLayersRef.current = [];

            if (selectedMetadata && selectedMetadata.concave_hull_geometry) {
                const geoJsonLayer = L.geoJSON(selectedMetadata.concave_hull_geometry, {
                    style: {
                        color: 'rgb(    255, 0, 0)',
                        weight: 0,
                        fillColor: 'rgb(255, 0, 0)',
                        fillOpacity: 0.2
                    }
                }).addTo(mapRef.current);
                geoJsonLayersRef.current.push(geoJsonLayer);
            } else if (!selectedMetadata) {
                activeMetadata.forEach(option => {
                    const geoJsonLayer = L.geoJSON(option.concave_hull_geometry, {
                        style: {
                            color: 'rgb(255, 0, 0)',
                            weight: 0,
                            fillColor: 'rgb(255, 0, 0)',
                            fillOpacity: 0.2
                        }
                    }).addTo(mapRef.current);
                    geoJsonLayersRef.current.push(geoJsonLayer);
                })
            }
        }
    }, [activeMetadata, selectedMetadata, mapZoomTrigger]);


    useEffect(() => {
        if (mapZoomTrigger && mapRef.current) {
            const bounds = turf.bbox(mapZoomTrigger);
            const leafletBounds = [[bounds[1], bounds[0]], [bounds[3], bounds[2]]];
            mapRef.current.fitBounds(leafletBounds);
        }
    }, [mapZoomTrigger]);

    return (
        <div className="chart-container">
            <MapContainer ref={mapRef} zoomControl={false} center={position} zoom={4} style={{ height: '38vh', width: '100%', minHeight: '280px' }}>
                <TileLayer
                    url="https://map.nowum.fh-aachen.de/cartodb/light_all/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <ZoomControl position='bottomleft' />

            </MapContainer>
        </div>

    );
}
export default MapComponent;
