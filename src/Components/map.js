import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	mapContainer: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
	},
}));

const MapContainer = (props) => {
	const classes = useStyles();

	const [markers, setMarkers] = React.useState([]);
	const [showInfoWindow, setShowInfoWindow] = React.useState(false);

	return (
		<div className={classes.mapContainer}>
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
				{markers.map((marker, i) => (
					<Marker
						title={'joku paikka'}
						name={'paikka'}
						position={{ lat: marker.lat, lng: marker.lng }}
						onClick={() => setShowInfoWindow(true)}
						key={i}
					>
						<InfoWindow visible={true} style={{ width: 200, height: 200 }}>
							<div style={{ width: 200, height: 200 }}>
								<p>
									Click on the map or drag the marker to select location where
									the incident occurred
								</p>
							</div>
						</InfoWindow>
					</Marker>
				))}
			</Map>
		</div>
	);
};

export default GoogleApiWrapper({
	apiKey: process.env.GOOGLE_MAPS_API_KEY,
})(MapContainer);
