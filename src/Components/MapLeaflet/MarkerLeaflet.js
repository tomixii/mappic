import React from 'react';
import { CircleMarker } from 'react-leaflet';

const MarkerLeaflet = (props) => (
	<CircleMarker
		center={props.location}
		radius={10}
		pathOptions={{ color: '#186fd6', fillColor: '#B1DFFB', fillOpacity: 1 }}
	/>
);

export default MarkerLeaflet;
