import React, { useState } from 'react';
import SingleBuildingInfo from './SingleBuildingInfo';
import AggregateBuildingInfo from './AggregateBuildingInfo';
import './Layout.css';
import { MIN_ZOOM_LEVEL } from '.././consts';

export function Sidebar({ featureAttributes, aggregateData, selectedGeoJSONData,currentBoundingBox }) {

  const downloadJSON = (data, filename) => {
    let jsonData;
    jsonData = {
      bounds: currentBoundingBox,
      ...(filename === 'aggregate_data.json'
        ? { features: data.features.map(feature => feature) }
        : data)
    };
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div >
      <div className="sidebar" style={{
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease-in-out'
      }}>
        <div style={{ flex: '1 0 30%', overflow: 'hidden' }}>
          <SingleBuildingInfo featureAttributes={featureAttributes} downloadJSON={downloadJSON} />
        </div>
        <div style={{ flex: '1 0 30%', overflow: 'hidden' }}>
          <AggregateBuildingInfo aggregateData={aggregateData} downloadJSON={downloadJSON} selectedGeoJSONData={selectedGeoJSONData} />
        </div>
      </div>
    </div>

  );
}


export function DropdownMenu({selectedOption, options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', zIndex: 10000 }}>
      <button onClick={() => setIsOpen(!isOpen)} className='button' style={{ height: '34px'}}>
        View ▼
      </button>
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', right: 0, zIndex: 100, backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc', width: '180px' }}>
          {options.map((option, index) => (
            <div key={index} onClick={() => handleOptionClick(option)} style={{ cursor: 'pointer', backgroundColor: option.label === selectedOption.label ? 'lightyellow' : 'transparent' }}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function LoadingComponent({ loading, zoom }) {
  if (zoom <= MIN_ZOOM_LEVEL) {
    return (
      <div style={{}} >
        {<div> Zoom too low </div>}
      </div>
    );

  }

  return (
    <div style={{}} >
      {loading && <div> Loading From DB... </div>}
    </div>
  );
}
