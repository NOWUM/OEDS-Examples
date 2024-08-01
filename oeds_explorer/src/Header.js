import React, { useContext, useState } from 'react';
import { DBContext } from './DBContext';
import 'swagger-ui-react/swagger-ui.css';
import './RestTab.css';

function Header({ activeTab, setActiveTab, showPopup, setShowPopup }) {
    const { swaggerOptions, selectedProfile, setSelectedProfile } = useContext(DBContext);

    const handleButtonClick = (tab) => {
        setActiveTab(tab);
    }

    const getButtonStyle = (tab) => {
        return tab === activeTab ? { backgroundColor: '#f0f0f0' } : {};
    }

    const togglePopup = () => setShowPopup(!showPopup);


    return (
        <>
            <div className="App-header">
                <div className="top-header">
                    <h1>OEDS Explorer</h1>
                    <div className='button-container'>
                        <button className="button" onClick={() => handleButtonClick('rest')} style={getButtonStyle('rest')}>API</button>
                        <button className="button" onClick={() => handleButtonClick('metadata')} style={getButtonStyle('metadata')}>Metadata</button>
                    </div>
                </div>
                {activeTab === 'rest' &&
            
                    <div className="select-container" style={{ display: 'flex', alignItems: 'center' }}>
                        <button className="popup-button" onClick={togglePopup} style={{ marginLeft: '10px' }}>❓</button>
                        <select
                            value={selectedProfile}
                            onChange={e => setSelectedProfile(e.target.value)}
                            disabled={!swaggerOptions.length}
                            style={{ flex: 1 }}
                        >
                            {swaggerOptions.length > 0 ? (
                                swaggerOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))
                            ) : (
                                <option>Loading options...</option>
                            )}
                        </select>
                    </div>}
            </div>
        </>
    );
}



export default Header;
