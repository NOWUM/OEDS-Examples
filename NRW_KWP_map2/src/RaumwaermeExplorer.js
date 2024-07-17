import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './ui/Components';
import { DropdownMenu } from './ui/Components';
import HeatMap from './map/MapComponent';
import LegendComponent from './map/Legend';
import InfoTab from './ui/InfoTab';
import { MIN_ZOOM_LEVEL, SHOW_OPTIONS } from './consts';
import Wkt from 'wicket';

const MemoizedHeatMap = React.memo(HeatMap);

function Layout({ }) {
  var wkt = new Wkt.Wkt();
  const [activeTab, setActiveTab] = useState('map');
  const [featureAttributes, setFeatureAttributes] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentGeoJSONData, setCurrentGeoJSONData] = useState(null);
  const [selectedGeoJSONData, setSelectedGeoJSONData] = useState(null);
  const [selectedLegend, setSelectedLegend] = useState({ label: 'Specific Heat Demand', value: 'raum_waerme_wasser_waerme_bedarf' });
  const [currentBoundingBox, setCurrentBoundingBox] = useState(null);
  const [lastLoadedBoundingBox, setLastLoadedBoundingBox] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(MIN_ZOOM_LEVEL + 1);
  const [aggregateData, setAggregateData] = useState({
    objectCount: 0,
    totalArea: 0,
    totalHeatDemand: 0,
    buildingTypes: {}
  });
  const [featureCount, setFeatureCount] = useState(0);


  const fetchData = useCallback(() => {
    if (currentBoundingBox && zoom > MIN_ZOOM_LEVEL) {
      setLoading(true);

      const url = new URL(process.env.REACT_APP_OPENDATA_URL);
      url.searchParams.append('in_xmin', currentBoundingBox._southWest.lng);
      url.searchParams.append('in_ymin', currentBoundingBox._southWest.lat);
      url.searchParams.append('in_xmax', currentBoundingBox._northEast.lng);
      url.searchParams.append('in_ymax', currentBoundingBox._northEast.lat);

      fetch(url)
        .then(response => response.text())
        .then(data => {
          let db_json = JSON.parse(data);
          db_json = db_json.map((item) => {

            wkt.read(item.geometry);

            const geoJsonGeometry = wkt.toJson();
            return {
              type: "Feature",
              geometry: geoJsonGeometry,
              properties: {
                fest_id: item.fest_id,
                gemeinde: item.gemeinde,
                strasse: item.strasse,
                hausnr: item.hausnr,
                nutzung: item.nutzung,
                gebaeudetyp: item.gebaeudetyp,
                sanierungsstand: item.sanierungsstand,
                stockwerke: item.stkw,
                nutzflaeche: Number.parseFloat(item.nutzflaeche),
                spez_raum_waerme_wasser_waerme_bedarf: Number.parseFloat(item.rw_ww_spez),
                raum_waerme_wasser_waerme_bedarf: Number.parseFloat(item.rw_ww),
              },
            };
          });
          setCurrentGeoJSONData(db_json);
          setLastLoadedBoundingBox(currentBoundingBox);
          setFeatureCount(db_json.length);
        })
        .catch(error => {
          console.error("Network Error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentBoundingBox, zoom]);
  const fetchDataCalled = useRef(false);

  useEffect(() => {
    if (currentBoundingBox && !fetchDataCalled.current) {
      fetchData();
      fetchDataCalled.current = true;
    }
  }, [currentBoundingBox, fetchData]);

  const getReloadStyle = useCallback(() => {
    if (zoom <= MIN_ZOOM_LEVEL) {
      return {backgroundColor:'dimgray', border: '1px solid dimgray'};
    }
    else if (!currentBoundingBox || !lastLoadedBoundingBox) {
      return {backgroundColor:'orange' , border: '1px solid red'}
    } else if (!(
      lastLoadedBoundingBox._southWest.lng <= currentBoundingBox._southWest.lng &&
      lastLoadedBoundingBox._southWest.lat <= currentBoundingBox._southWest.lat &&
      lastLoadedBoundingBox._northEast.lng >= currentBoundingBox._northEast.lng &&
      lastLoadedBoundingBox._northEast.lat >= currentBoundingBox._northEast.lat
    )) {
      return {backgroundColor:'orange', border: '1px solid red'};
    }
    else {
      return  {backgroundColor: 'lightgreen', border: '1px solid lightgreen'};
    }
  }, [currentBoundingBox, lastLoadedBoundingBox,]);



  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prevState => !prevState);
  }, []);

  const handleFeatureClick = useCallback((attributes) => {
    setFeatureAttributes(attributes);
  }, []);


  const getFeatureCountColor = (count) => {
    if (count < 2000) {
      return 'lightgreen';
    } else if (count < 10000) {
      return 'orange';
    } else {
      return 'red';
    }
  };

  const handleSelect = (option) => {
    setSelectedLegend(SHOW_OPTIONS.find((item) => item.value === option));
  };
  
  return (
    <div style={{ height: '100vh', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px' }}>
        <h1 style={{ fontSize: '26px', margin: '0' }}>KWP NRW Map</h1>
        <div style={{ display: 'flex' }}>
          <button style={{  }} className='button' onClick={() => setActiveTab('map')}>Map</button>
          <button style={{  }} className='button' onClick={() => setActiveTab('info')}>Info</button>
        </div>
      </div>
      {activeTab === 'map' ? (
        <>
          <LegendComponent selectedLegend={selectedLegend}  />

          <div style={{ position: 'absolute' , top: '56px', zIndex: '100000'}}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex' }}>

                <button className='button' onClick={toggleSidebar}>
                  {isSidebarOpen ? "❌" : "🔍"}
                </button>
                <button
                  className='button'
                  onClick={fetchData}
                  style= {getReloadStyle()}
                >
                  {loading ? '⏳' : '🔄'}
                </button>
                <span
                  className='button'
                  style={{
                    backgroundColor: getFeatureCountColor(featureCount),
                    width: '80px',
                    textAlign: 'center'
                  }}>
                  #{featureCount}
                </span>
                <DropdownMenu selectedOption={selectedLegend} options={SHOW_OPTIONS} onSelect={(option) => handleSelect(option)} />
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {isSidebarOpen && (
              <Sidebar
                featureAttributes={featureAttributes}
                aggregateData={aggregateData}
                selectedGeoJSONData={selectedGeoJSONData}
                currentBoundingBox={currentBoundingBox}
              />
            )}

            <div style={{ flex: 1, position: 'relative' }}>
              <MemoizedHeatMap
                currentGeoJSONData={currentGeoJSONData}
                setCurrentBoundingBox={setCurrentBoundingBox}
                selectedLegend={selectedLegend}
                onFeatureClick={handleFeatureClick}
                setAggregateData={setAggregateData}
                setSelectedGeoJSONData={setSelectedGeoJSONData}
                zoom={zoom}
                setZoom={setZoom}
              />
            </div>
          </div>

        </>
      ) : (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <InfoTab />
        </div>
      )}







    </div>
  );
}

function RaumwaermeExplorer() {
  return (
    <div>
      <Layout />
    </div>
  );
}

export default RaumwaermeExplorer;
