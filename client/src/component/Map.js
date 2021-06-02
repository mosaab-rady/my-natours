/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';

import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

export default function Map({ locations }) {
  mapboxgl.workerClass = MapboxWorker;
  mapboxgl.accessToken =
    'pk.eyJ1IjoibW9zYWFiLXJhZGkiLCJhIjoiY2tudGNlemRtMDFuZDJva2dqOHZ5eWd3biJ9.UqnuRReOXieyD9K1kVmb9A';

  const mapContainer = useRef();
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      scrollZoom: false,

      // center: [lng, lat],
      // zoom: zoom,
    });
    // Set options
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc) => {
      // Add marker
      new mapboxgl.Marker({
        color: '#55c57a',
      })
        .setLngLat(loc.coordinates)
        .addTo(map);

      // Add popup
      new mapboxgl.Popup({
        offset: 60,
      })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);

      // Extend map bounds to include current location
      bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
      padding: {
        top: 250,
        bottom: 250,
        left: 100,
        right: 100,
      },
    });
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });

    return () => map.remove();
  });

  return (
    <div>
      <div className='map-container' ref={mapContainer} />
    </div>
  );
}
