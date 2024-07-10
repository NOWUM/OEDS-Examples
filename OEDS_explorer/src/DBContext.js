import React, { createContext, useState, useEffect } from 'react';

export const DBContext = createContext();

export const DBProvider = ({ children }) => {
    const [swaggerSpec, setSwaggerSpec] = useState(null);
    const [swaggerOptions, setSwaggerOptions] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState('');
    const [metadataOptions, setMetadataOptions] = useState([]);

    useEffect(() => {
        fetch(process.env.REACT_APP_OPENDATA_URL + "/rpc/swagger_schemas")
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort((a, b) => a.localeCompare(b));
                setSwaggerOptions(sorted);
                if (data.length > 0) {
                    setSelectedProfile(data[0]);
                }
            })
            .catch(error => console.error('Error fetching swagger schemas:', error));
    }, []);

    useEffect(() => {
        if (!selectedProfile) return;

        const url = new URL(process.env.REACT_APP_OPENDATA_URL +"/");
        fetch(url, {
            headers: new Headers({
                'Accept-Profile': selectedProfile
            })
        }).then(response => response.text())
            .then(response => {
                setSwaggerSpec(JSON.parse(response));
            })
            .catch(error => console.error('Error fetching swagger spec:', error));
    }, [selectedProfile]);

    useEffect(() => {
        if (!selectedProfile) return;

        const url = new URL(process.env.REACT_APP_OPENDATA_URL +"/metadata");
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort((a, b) => a.schema_name.localeCompare(b.schema_name));
                setMetadataOptions(sorted);
            })
            .catch(error => console.error('Error fetching swagger schemas:', error));
    }, [selectedProfile]);

    return (
        <DBContext.Provider value={{ swaggerSpec, swaggerOptions, metadataOptions, selectedProfile, setSelectedProfile }}>
            {children}
        </DBContext.Provider>
    );
};
