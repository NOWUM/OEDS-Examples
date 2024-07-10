import React from 'react';

const convertEEK = (value) => {
    const eekMap = {
        0: 'A+',
        1: 'A',
        2: 'B',
        3: 'C',
        4: 'D',
        5: 'E',
        6: 'F',
        7: 'G',
        8: 'H',
    };

    return eekMap[value] || 'Unknown';
};

const SingleBuildingInfo = ({ featureAttributes, downloadJSON }) => {
    const feature_props = (featureAttributes && featureAttributes.properties) ? featureAttributes.properties : null;

    return (
        <div style={{ borderBottom: '1px solid gray', padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Single building</h2>
                {feature_props && <button className='button' onClick={() => downloadJSON(featureAttributes, 'building_data.json')}>Download</button>}
            </div>
            {feature_props ? (
                <>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{ width: '120px' }}><b>Function:</b></td>
                                <td style={{ width: '120px', height: '100px', textAlign: 'right' }}>{feature_props.nutzung}</td>
                            </tr>
                            <tr>
                                <td style={{ width: '120px' }}><b>Building type:</b></td>
                                <td style={{ width: '120px', textAlign: 'right' }}>{feature_props.gebaeudetyp ? feature_props.gebaeudetyp : "Keine Angabe"}</td>
                            </tr>
                            <tr>
                                <td style={{ width: '120px' }}><b>Energieeffizenzklasse:</b></td>
                                <td style={{ width: '120px', textAlign: 'right' }}>{convertEEK(feature_props?.sanierungsstand)}</td>
                            </tr>
                            <tr>
                                <td style={{ width: '120px' }}><b>Heat area (m²):</b></td>
                                <td style={{ width: '120px', textAlign: 'right' }}>{feature_props.nutzflaeche.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style={{ width: '120px' }}><b>Heat demand (kWh/m²a):</b></td>
                                <td style={{ width: '120px', textAlign: 'right' }}>{feature_props.spez_raum_waerme_wasser_waerme_bedarf.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style={{ width: '120px' }}><b>Heat demand (kWh/a):</b></td>
                                <td style={{ width: '120px', textAlign: 'right' }}>{feature_props.raum_waerme_wasser_waerme_bedarf.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            ) : <p>No selection</p>}
        </div>
    );
};

export default SingleBuildingInfo;
