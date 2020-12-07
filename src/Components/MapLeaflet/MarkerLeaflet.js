import React from 'react';
import { CircleMarker } from 'react-leaflet';

const MarkerLeaflet = (props) => (
	<CircleMarker
		eventHandlers={{
			click: () => {
				props.openSidePanel(props.location[0], props.location[1]);
			},
		}}
		center={props.location}
		radius={10}
		pathOptions={{ color: '#186fd6', fillColor: '#B1DFFB', fillOpacity: 1 }}
	/>
);

export default MarkerLeaflet;
