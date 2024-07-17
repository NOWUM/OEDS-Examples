import React, { useState } from 'react';
import './MapComponent.css';
import { uniqueFunctions, funcColours, buildingTypeColours, sanierungsstandColours } from './LegendDefs';


const functionColorMap = new Map();
uniqueFunctions.forEach((func) => {
    if (!func || !func.funcType) return;
    if (!functionColorMap.has(func.funcType)) {
        functionColorMap.set(func.funcType, funcColours.find((o) => {
            return o.funcType === func.funcType
        }).colour);
    }
});

export const LegendComponent = ({ selectedLegend }) => {
    const [isLegendVisible, setIsLegendVisible] = useState(true);

    const toggleLegend = () => {
        setIsLegendVisible(!isLegendVisible);
    };

    const renderLegend = () => {
        if (!isLegendVisible) return null;
        switch (selectedLegend.value) {

            case 'nutzung':
                return functionLegend;
            case 'gebaeudetyp':
                return buildingTypeLegend;
            case 'sanierungsstand':
                return sanierungstandLegend;
            case 'nutzflaeche':
                return heatAreaLegend;
            case 'spez_raum_waerme_wasser_waerme_bedarf':
                return wbAbsLegend;
            case 'raum_waerme_wasser_waerme_bedarf':
                return wbSPZLegend;
            default:
                return null;
        }
    };

    return (
        <div className="legend-container">
            {renderLegend()}
            <div className="">
                <button className="legend-button" onClick={toggleLegend}>
                    {isLegendVisible ? "Hide Legend" : "Show Legend"}
                </button>
            </div>
        </div>
    );
}

const functionLegendItems = Array.from(functionColorMap.entries()).map(([shortenedText, color]) => (
    <div className="legend-item" key={shortenedText}>
        <div className="legend-color" style={{ backgroundColor: color }}></div>
        <div className="legend-label">{shortenedText}</div>
    </div>
));



const functionLegend = (
    <div className="legend">
        <div className="legend-title">Building Usage</div>
        {functionLegendItems}
    </div>
);

const buildingTypeLegendItems = buildingTypeColours.map(({ buildingType, colour }) => (
    <div className="legend-item" key={buildingType}>
        <div className="legend-color" style={{ backgroundColor: colour }}></div>
        <div className="legend-label">{buildingType}</div>
    </div>
));

const buildingTypeLegend = (
    <div className="legend">
        <div className="legend-title">Building Type</div>
        {buildingTypeLegendItems}
    </div>
);

const sanierungstandLegendItems = sanierungsstandColours.map(({ buildingType, colour }) => (
    <div className="legend-item" key={buildingType}>
        <div className="legend-color" style={{ backgroundColor: colour }}></div>
        <div className="legend-label">{buildingType}</div>
    </div>
));

const sanierungstandLegend = (
    <div className="legend">
        <div className="legend-title">Energy Efficiency Class</div>
        {sanierungstandLegendItems}
    </div>
);


export const heatAreaLegend = (
    <div className="legend">
        <div className="legend-title"> Heat area (m²)</div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'rgb(204, 229, 255)' }}></div>
            <div className="legend-label"> &lt; 20</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'rgb(153, 204, 255)' }}></div>
            <div className="legend-label">20.1-100.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'rgb(102, 178, 255)' }}></div>
            <div className="legend-label">100.1-500.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'rgb(51, 153, 255)' }}></div>
            <div className="legend-label">500.1-1000.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'rgb(0, 128, 255)' }}></div>
            <div className="legend-label">1000.1-2000.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'rgb(0, 102, 204)' }}></div>
            <div className="legend-label">2000.1-3000.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'rgb(0, 77, 153)' }}></div>
            <div className="legend-label">3000.1-4000.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'rgb(0, 51, 102)' }}></div>
            <div className="legend-label">4000.1-5000.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'rgb(0, 26, 51)' }}></div>
            <div className="legend-label">&gt; 5000.1  </div>
        </div>
    </div>
);

export const wbSPZLegend = (
    <div className="legend">
        <div className="legend-title">Specific Heat demand <br /> (kWh/m²a)</div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'white' }}></div>
            <div className="legend-label">0.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#b0ff00' }}></div>
            <div className="legend-label">0.1-80.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#bed600' }}></div>
            <div className="legend-label">80.1-120.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#c1ae00' }}></div>
            <div className="legend-label">120.1-140.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ba8800' }}></div>
            <div className="legend-label">140.1-160.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ab6400' }}></div>
            <div className="legend-label">160.1-200.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#954200' }}></div>
            <div className="legend-label">200.1-240.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#7b2200' }}></div>
            <div className="legend-label">240.1-280.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#5c0000' }}></div>
            <div className="legend-label">280.1-342.0</div>
        </div>
    </div>
);

export const wbAbsLegend = (
    <div className="legend">
        <div className="legend-title">Abs. Heat demand <br /> (kWh/a)</div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'white' }}></div>
            <div className="legend-label">&lt; 2000</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#b0ff00' }}></div>
            <div className="legend-label">2000.1-5000.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#bed600' }}></div>
            <div className="legend-label">5000.1-10000.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#c1ae00' }}></div>
            <div className="legend-label">10000.1-20000.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ba8800' }}></div>
            <div className="legend-label">20000.1-50000.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ab6400' }}></div>
            <div className="legend-label">50000.1-100000.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#954200' }}></div>
            <div className="legend-label">100000.1-500000.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#7b2200' }}></div>
            <div className="legend-label">500000.1-1000000.0</div>
        </div>
        <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#5c0000' }}></div>
            <div className="legend-label"> &gt; 1000000.0  </div>
        </div>
    </div>
);


export function legendHandler(selectedLegend, feature, zoom, lastSelected) {
    const weight = zoom < 17 ? 0 : 0.5;

    if (feature.properties.fest_id === lastSelected) {
        return { fillColor: 'blue', fillOpacity: 1, color: 'black', weight: weight };
    } else {
        let option = selectedLegend.value;
        switch (option) {
            case 'nutzung':
                const funktion = feature.properties.nutzung;
                return selectLegendFunction(funktion, weight);
            case 'gebaeudetyp':
                const buildingType = feature.properties.gebaeudetyp;
                return selectLegendBuildingType(buildingType, weight);
            case 'sanierungsstand':
                const sanierungsstand = feature.properties.sanierungsstand;
                return selectLegendSanierungsstand(sanierungsstand, weight);
            case 'nutzflaeche':
                const nutzflaeche = feature.properties.nutzflaeche;
                return selectLegendNutzflaeche(nutzflaeche, weight);
            case "spez_raum_waerme_wasser_waerme_bedarf":
                const WBSpzValue = feature.properties.spez_raum_waerme_wasser_waerme_bedarf;
                return selectLegendWBSpz(WBSpzValue, weight);
            case 'raum_waerme_wasser_waerme_bedarf':
                const RW_WW = feature.properties.raum_waerme_wasser_waerme_bedarf;
                return selectLegendRW_WW(RW_WW, weight);
            default:

                return null;
        }
    }
}

function selectLegendFunction(funktion, weight) {
    const commonProperties = { fillOpacity: 0.5, color: 'black', weight: weight };

    const tobe = funktion.replace(/\s/g, '');

    const funcType = uniqueFunctions.find((o) => {
        const is = o.fullText.replace(/\s/g, '');
        return is === tobe
    }).funcType;

    const colour = funcColours.find((o) => {
        return o.funcType === funcType
    })?.colour || '#d3d3d3';

    return { ...commonProperties, fillColor: colour };
}


function selectLegendBuildingType(buildingType, weight) {
    const commonProperties = { fillOpacity: 0.5, color: 'black', weight: weight };
    const string = buildingType.replace(/\s/g, '');

    const [type, age] = string.split('_');
    const colour = buildingTypeColours.find((o) => {
        return o.buildingType == type;
    })?.colour || '#d3d3d3';

    return { ...commonProperties, fillColor: colour };
}
function selectLegendSanierungsstand(feat, weight) {
    const commonProperties = { fillOpacity: 0.5, color: 'black', weight: weight };
    const roundedFeat = Math.round(feat);

    switch (roundedFeat) {
        case 0:
            return { ...commonProperties, fillColor: 'white' };
        case 1:
            return { ...commonProperties, fillColor: '#b0ff00' };
        case 2:
            return { ...commonProperties, fillColor: '#bed600' };
        case 3:
            return { ...commonProperties, fillColor: '#c1ae00' };
        case 4:
            return { ...commonProperties, fillColor: '#ba8800' };
        case 5:
            return { ...commonProperties, fillColor: '#ab6400' };
        case 6:
            return { ...commonProperties, fillColor: '#954200' };
        case 7:
            return { ...commonProperties, fillColor: '#7b2200' };
        default:
            return { ...commonProperties, fillColor: '#5c0000' };
    }
}

function selectLegendNutzflaeche(feat, weight) {
    const commonProperties = { fillOpacity: 0.5, color: 'black', weight: weight };

    switch (true) {
        case (feat < 20):
            return { ...commonProperties, fillColor: 'rgb(204, 229, 255)' };
        case (feat < 100):
            return { ...commonProperties, fillColor: 'rgb(153, 204, 255)' };
        case (feat < 500):
            return { ...commonProperties, fillColor: 'rgb(102, 178, 255)' };
        case (feat < 1000):
            return { ...commonProperties, fillColor: 'rgb(51, 153, 255)' };
        case (feat < 2000):
            return { ...commonProperties, fillColor: 'rgb(0, 128, 255)' };
        case (feat < 3000):
            return { ...commonProperties, fillColor: 'rgb(0, 102, 204)' };
        case (feat < 4000):
            return { ...commonProperties, fillColor: 'rgb(0, 77, 153)' };
        case (feat < 5000):
            return { ...commonProperties, fillColor: 'rgb(0, 51, 102)' };
        default:
            return { ...commonProperties, fillColor: 'rgb(0, 26, 51)' };
    }
}
function selectLegendWBSpz(feat, weight) {
    const commonProperties = { fillOpacity: 0.5, color: 'black', weight: weight };

    switch (true) {
        case (feat < 5.0):
            return { ...commonProperties, fillColor: 'white' };
        case (feat < 80.0):
            return { ...commonProperties, fillColor: '#b0ff00' };
        case (feat < 120.0):
            return { ...commonProperties, fillColor: '#bed600' };
        case (feat < 140.0):
            return { ...commonProperties, fillColor: '#c1ae00' };
        case (feat < 160.0):
            return { ...commonProperties, fillColor: '#ba8800' };
        case (feat < 200.0):
            return { ...commonProperties, fillColor: '#ab6400' };
        case (feat < 240.0):
            return { ...commonProperties, fillColor: '#954200' };
        case (feat < 280.0):
            return { ...commonProperties, fillColor: '#7b2200' };
        default:
            return { ...commonProperties, fillColor: '#5c0000' };
    }
}


function selectLegendRW_WW(feat, weight) {
    const commonProperties = { fillOpacity: 0.5, color: 'black', weight: weight };

    switch (true) {
        case (feat < 2000):
            return { ...commonProperties, fillColor: 'white' };
        case (feat < 5000):
            return { ...commonProperties, fillColor: '#b0ff00' };
        case (feat < 10000):
            return { ...commonProperties, fillColor: '#bed600' };
        case (feat < 20000):
            return { ...commonProperties, fillColor: '#c1ae00' };
        case (feat < 50000):
            return { ...commonProperties, fillColor: '#ba8800' };
        case (feat < 100000):
            return { ...commonProperties, fillColor: '#ab6400' };
        case (feat < 500000):
            return { ...commonProperties, fillColor: '#954200' };
        case (feat < 1000000):
            return { ...commonProperties, fillColor: '#7b2200' };
        case (feat < 10000000):
            return { ...commonProperties, fillColor: '#5c0000' };
        default:
            return { ...commonProperties, fillColor: 'black' };
    }
}

export default LegendComponent;
