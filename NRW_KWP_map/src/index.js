import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RaumwaermeExplorer from './RaumwaermeExplorer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RaumwaermeExplorer />
  </React.StrictMode>
);
