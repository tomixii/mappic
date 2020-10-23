import React from 'react';
import { connect } from 'react-redux';
//import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import GoogleMapReact from 'google-map-react';
import { makeStyles } from '@material-ui/core/styles';
import { withFirebase } from '../Firebase';

import {
	setMapImages,
	setAreaImages,
	setLocation,
} from '../../redux/actions/dataActions';
import MapMarker from './MapMarker';
import SearchArea from './SearchArea';

import { getDistanceFromLatLonInKm } from '../../utils';

const useStyles = makeStyles((theme) => ({
	mapContainer: {
		width: '100%',
		height: '100vh',
		position: 'absolute',
		top: 0,
		left: 0,
	},
}));

const MapContainer = (props) => {
	const classes = useStyles();

	//const [markers, setMarkers] = React.useState([]);

	const handleApiLoaded = (map, maps) => {
		fetchImagesInBounds({
			north: map.getBounds().Ya.j,
			east: map.getBounds().Sa.j,
			south: map.getBounds().Ya.i,
			west: map.getBounds().Sa.i,
		});
	};

	const fetchImagesInBounds = (bounds) => {
		const images = [];
		props.firebase
			.pictures()
			.where('latitude', '<', bounds.north)
			.where('latitude', '>', bounds.south)
			.get()
			.then((data) => {
				data.forEach((doc) => {
					if (
						doc.data().longitude > bounds.west &&
						doc.data().longitude < bounds.east
					) {
						images.push(doc.data());
					}
				});
			})
			.then(() => {
				props.setMapImages(images);
			});
	};

	return (
		<div className={classes.mapContainer}>
			<GoogleMapReact
				bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY }}
				defaultZoom={14}
				defaultCenter={{ lat: 60.18, lng: 24.82 }}
				yesIWantToUseGoogleMapApiInternals
				onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
				onChange={(event) =>
					fetchImagesInBounds({
						north: event.bounds.ne.lat,
						east: event.bounds.ne.lng,
						south: event.bounds.sw.lat,
						west: event.bounds.sw.lng,
					})
				}
				onClick={(coord) => {
					const { lat, lng } = coord;
					props.setLocation({ lat, lng });

					props.setAreaImages(
						props.data.mapImages.filter(
							(image) =>
								getDistanceFromLatLonInKm(
									image.latitude,
									image.longitude,
									lat,
									lng
								) < 1
						)
					);
					props.openSidePanel();
					/*
					setMarkers([...markers, { lat, lng }]);
					console.log('marker added at: ', lat, lng);
					*/
				}}
			>
				{props.data.mapImages.map((marker, i) => (
					<MapMarker lat={marker.latitude} lng={marker.longitude} key={i} />
				))}
				{props.data.location && (
					<SearchArea
						lat={props.data.location.lat}
						lng={props.data.location.lng}
					/>
				)}
			</GoogleMapReact>
		</div>
	);
};

const mapStateToProps = (state) => ({
	data: state.data,
});

const mapActionsToProps = {
	setMapImages,
	setAreaImages,
	setLocation,
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(withFirebase(MapContainer));
