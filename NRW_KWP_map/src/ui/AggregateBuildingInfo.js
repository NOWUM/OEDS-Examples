import React from 'react';

function AggregateBuildingInfo({ aggregateData, downloadJSON, selectedGeoJSONData }) {
    return (
        <div style={{ padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Selection</h2>
                {aggregateData.objectCount !== 0 && <button className='button' onClick={() => downloadJSON(selectedGeoJSONData, 'aggregate_data.json')}>Download</button>}
            </div>
            {aggregateData.objectCount !== 0 ? (
                <>
                    <table>
                        <tbody>
                            <tr><td style={{ width: '120px' }}><b>Object count:</b></td><td style={{ width: '120px', textAlign: 'right' }}>{aggregateData.objectCount}</td></tr>
                            <tr><td style={{ width: '120px' }}><b>Heat area (m²):</b></td><td style={{ width: '120px', textAlign: 'right' }}>{aggregateData.totalArea.toFixed(2)}</td></tr>
                            <tr><td style={{ width: '120px' }}><b>Heat demand (kWh/a):</b></td><td style={{ width: '120px', textAlign: 'right' }}>{aggregateData.totalHeatDemand.toFixed(2)}</td></tr>
                            <tr style={{ padding: '10px' }}>
                                <td colSpan="2" style={{ textAlign: 'center' }}><b>Building type counts</b></td>
                            </tr>
                            {Object.entries(aggregateData.buildingTypes).map(([type, count]) => (
                                <tr key={type}>
                                    <td style={{ width: '120px' }}><b>{type ? type + ":" : "Keine Angabe:"}</b></td>
                                    <td style={{ width: '120px', textAlign: 'right' }}>{count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : <p>No selection</p>}
        </div>
    );
}

export default AggregateBuildingInfo;
