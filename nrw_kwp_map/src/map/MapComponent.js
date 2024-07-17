/* global L */
import { React, useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, GeoJSON, useMapEvents, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw';
import leafletPip from '@mapbox/leaflet-pip';
import './MapComponent.css';
import { LegendComponent, legendHandler } from './Legend.js';
import { MIN_ZOOM_LEVEL, STARTING_POSITION } from '../consts.js';

function MapComponent({ currentGeoJSONData, setCurrentBoundingBox, selectedLegend, onFeatureClick, setAggregateData, setSelectedGeoJSONData, zoom, setZoom }) {

    const lastDrawnLayer = useRef(null);
    const [lastSelected, setLastSelected] = useState(null);

    const currentGeoJSONDataRef = useRef(null);

    useEffect(() => {
        currentGeoJSONDataRef.current = currentGeoJSONData;
    }, [currentGeoJSONData]);

    function onEachFeature(feature, layer) {
        layer.on({
            click: function (e) {
                setLastSelected(feature.properties.fest_id);
                onFeatureClick(feature);
            }
        });
    }

    function GeoJSONFeatures() {
        return (
            <GeoJSON
                data={currentGeoJSONData}
                onEachFeature={onEachFeature}
                style={(feature) => {
                    return legendHandler(selectedLegend, feature, zoom, lastSelected);
                }
                }
            />
        );
    }


    function MapState({ setZoom }) {
        const map = useMapEvents({
            zoomend() {
                setZoom(map.getZoom());
            },
            moveend() {
                const currentBounds = map.getBounds();
                setCurrentBoundingBox(currentBounds);
            },
            zoomlevelschange() {
                const currentBounds = map.getBounds();
                setCurrentBoundingBox(currentBounds);
            }
        });
        return null;
    }

    const handleDelete = (e) => {
    };

    function drawComplete(e) {
        if (lastDrawnLayer.current) {
            lastDrawnLayer.current.remove();
        }
        if (currentGeoJSONDataRef.current) {
            lastDrawnLayer.current = e.layer;

            const filteredData = filterFeatures(e.layer, currentGeoJSONDataRef.current);
            setSelectedGeoJSONData(filteredData);
            handleSelectionDrawn(filteredData);
        } else {
            console.error("currentGeoJSONData is null");
        }


    };

    const handleSelectionDrawn = (filteredData) => {
        const updatedData = {
            objectCount: 0,
            totalArea: 0,
            totalHeatDemand: 0,
            buildingTypes: {}
        };

        updatedData.objectCount = filteredData.features.length;
        filteredData.features.forEach(feature => {
            updatedData.totalArea += feature.properties.nutzflaeche;
            updatedData.totalHeatDemand += feature.properties.raum_waerme_wasser_waerme_bedarf;

            updatedData.buildingTypes[feature.properties.gebaeudetyp.split('_')[0]] = (updatedData.buildingTypes[feature.properties.gebaeudetyp.split('_')[0]] || 0) + 1;
        });

        setAggregateData(updatedData);
    };

    function filterFeatures(layer, data) {
        const drawnShape = L.geoJSON(layer.toGeoJSON());
        const features = data.filter(feature => {
            const latLng = new L.LatLng(feature.geometry.coordinates[0][0][0][1], feature.geometry.coordinates[0][0][1][0]);
            return leafletPip.pointInLayer(latLng, drawnShape, true).length > 0;
        });

        return {
            features,
        };
    }

    return (

        <MapContainer
            center={STARTING_POSITION}
            zoom={MIN_ZOOM_LEVEL + 3}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url={process.env.REACT_APP_TILEHOST_URL}
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                maxZoom={19}
            />
            <FeatureGroup>
                <EditControl
                    position="topright"
                    onCreated={drawComplete}
                    onDeleted={handleDelete}
                    edit={{
                        edit: false,
                        remove: true,
                    }}
                    draw={{
                        rectangle: {
                            shapeOptions: { fill: false },
                        },
                        polygon: {
                            shapeOptions: { fill: false },
                        },
                        circle: false,
                        circlemarker: false,
                        marker: false,
                        polyline: false,
                        line: false,
                    }}
                />
                <ZoomControl position="topright" />
                <MapState setZoom={setZoom} />

            </FeatureGroup>
            <GeoJSONFeatures currentGeoJSONData={currentGeoJSONData} />

        </MapContainer>
    );
}

export default MapComponent;
