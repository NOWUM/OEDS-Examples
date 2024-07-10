import React from 'react';
import { FiFileText, FiMap, FiCode, FiBook, FiLayers } from 'react-icons/fi';
function InfoTab() {
  const links = [
    {
      icon: <FiFileText size={48} />,
      title: 'IWU',
      url: 'https://www.iwu.de/fileadmin/publikationen/gebaeudebestand/episcope/2015_IWU_LogaEtAl_Deutsche-Wohngeb%C3%A4udetypologie.pdf',
    },
    {
      icon: <FiMap size={48} />,
      title: 'OpenNRW KWP',
      url: 'https://www.opengeodata.nrw.de/produkte/umwelt_klima/klima/kwp/',
    },
    {
      icon: <FiCode size={48} />,
      title: 'React Leaflet',
      url: 'https://react-leaflet.js.org/',
    },
    {
      icon: <FiLayers size={48} />,
      title: 'FH Aachen',
      url: 'https://www.fh-aachen.de/forschung/institute/nowum/forschung-und-entwicklung-am-institut-nowum-energy/nachhaltige-energiesysteme',
    },
  ];

  const handleLinkClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div style={{ padding: '10px', overflowY: 'auto', height: 'calc(100vh - 60px)' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img src={"/Guide.png"} alt="Guide" style={{ maxWidth: '100%', height: 'auto'  }} />

      </div>
      <ul>
          <li>A: Inspect selection window toggle</li>
          <li>B: Reload data button</li>
          <li>C: Current rendered object count</li>
          <li>D: Currently selected KWP NRW attribute</li>
          <li>E: Legend for selected element in (D) toggle</li>
        </ul>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        {links.map((link) => (
          <div
            key={link.title}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'transform 0.3s',
            }}
            onClick={() => handleLinkClick(link.url)}
          >
            {link.icon}
            <a href={link.url} style={{ marginTop: '5px' }}>{link.title}</a>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <ul style={{ textAlign: 'left', marginLeft: 'auto', marginRight: 'auto', maxWidth: '600px', marginTop: '20px' }}>
          <li style={{ marginBottom: '10px' }}>
            This project aims to visualize the <b>OpenNRW KWP Dataset</b>. It provides users with the ability to explore and analyze the data and export their selected information.
            Data is provided by the <b>OpenNRW KWP Dataset</b> by OpenGeoData.NRW which is produced with the DL-DE Zero-2.0 Licence.
          </li>
          <li style={{ marginBottom: '10px' }}>
            The <b>OpenNRW KWP Dataset</b> estimates space heating demand using building and usage data. It incorporates the IWU typology, Lanuv data, and other datasets into its own calculations. It contains a variety of useful attributes for district heating planning, at a building level granularity.
          </li>
          <li style={{ marginBottom: '10px' }}>
            Background tiles are taken from OpenMapTiles and used strictly for educational Purposes.
          </li>
          <li style={{ marginBottom: '10px' }}>
            This project was developed at the <b>FH Aachen's NOWUM institute</b>. The goal is to give the general public an easy way to 
            access, interact with, visualize and export the data from the KWP NRW Dataset.
          </li>
        </ul>
        <p>
          For more information or if you have any questions, please contact <a href="mailto:aliseyko@fh-aachen.de">aliseyko@fh-aachen.de</a>.
        </p>
      </div>
    </div>
  );
}

export default InfoTab;
