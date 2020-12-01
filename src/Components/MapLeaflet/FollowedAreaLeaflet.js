import React from 'react';
import { Circle } from 'react-leaflet';

const MarkerLeaflet = (props) => (
	<Circle
		eventHandlers={{
			click: () => props.openSidePanel(props.location[0], props.location[1]),
		}}
		center={props.location}
		radius={500}
		pathOptions={{ stroke: false, fillColor: 'green', fillOpacity: 0.4 }}
	/>
);

export default MarkerLeaflet;
