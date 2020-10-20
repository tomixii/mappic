import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

import MapMarker from './MapMarker';

const MapContainer = (props) => {
	const [markers, setMarkers] = React.useState([]);
	const [showInfoWindow, setShowInfoWindow] = React.useState(false);
	console.log(process.env.GOOGLE_MAPS_API_KEY);
	return (
		<Map
			google={props.google}
			zoom={14}
			style={{ width: '100%', height: '100%', position: 'relative' }}
			onClick={(t, map, coord) => {
				const { latLng } = coord;
				setMarkers([...markers, { lat: latLng.lat(), lng: latLng.lng() }]);
				console.log('marker added at: ', latLng.lat(), latLng.lng());
			}}
		>
			{markers.map((marker) => (
				<Marker
					title={'joku paikka'}
					name={'paikka'}
					position={{ lat: marker.lat, lng: marker.lng }}
					onClick={() => setShowInfoWindow(true)}
				>
					<InfoWindow visible={true} style={{ width: 200, height: 200 }}>
						<div style={{ width: 200, height: 200 }}>
							<p>
								Click on the map or drag the marker to select location where the
								incident occurred
							</p>
						</div>
					</InfoWindow>
				</Marker>
			))}
		</Map>
	);
};

export default GoogleApiWrapper({
	apiKey: process.env.GOOGLE_MAPS_API_KEY,
})(MapContainer);
