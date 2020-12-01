import React from 'react';
import { Circle } from 'react-leaflet';

const MarkerLeaflet = (props) => (
	<Circle
		center={props.location}
		radius={500}
		pathOptions={{ color: '#186fd6', fillColor: '#B1DFFB', fillOpacity: 0.4 }}
	/>
);

export default MarkerLeaflet;
