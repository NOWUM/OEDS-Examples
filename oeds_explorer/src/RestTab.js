import React, { useContext, useRef, useEffect } from 'react';
import { DBContext } from './DBContext';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import './RestTab.css';

function RestTab() {
    const { swaggerSpec, swaggerOptions, selectedProfile } = useContext(DBContext);
    const isLoading = !swaggerSpec || !swaggerOptions;

    return (
        <>
            <div className="rest-tab">
                {isLoading && <div className="loading-container">Loading...</div>}
                {!isLoading && swaggerSpec && (
                    <Swagger
                        swaggerSpec={swaggerSpec}
                        selectedProfile={selectedProfile}
                    />
                )}
            </div>
        </>
    );
}

function Swagger({ swaggerSpec, selectedProfile }) {
    const profileRef = useRef(selectedProfile);

    useEffect(() => {
        profileRef.current = selectedProfile; 
    }, [selectedProfile]);

    const getSwaggerConfig = () => ({
        ...swaggerSpec,
        requestInterceptor: (request) => {
            request.headers['Accept-Profile'] = profileRef.current;
            request.headers['Content-Profile'] = profileRef.current;
            return request;
        }
    });

    const config = getSwaggerConfig();

    return (
        <>
            <SwaggerUI spec={swaggerSpec} {...config} />
        </>
    );
}

export default RestTab;
