import React from 'react';
import { connect } from 'react-redux';
//import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import GoogleMapReact, { meters2ScreenPixels } from 'google-map-react';
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
import { Grow } from '@material-ui/core';

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
	const [currentZoom, setCurrentZoom] = React.useState(14);

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
			.where('lat', '<', bounds.north)
			.where('lat', '>', bounds.south)
			.get()
			.then((data) => {
				data.forEach((doc) => {
					if (doc.data().lng > bounds.west && doc.data().lng < bounds.east) {
						images.push(doc.data());
					}
				});
			})
			.then(() => {
				console.log(images);
				props.setMapImages(images);
				console.log(`Saved ${images.length} image(s) to redux`);
			});
	};

	return (
		<div className={classes.mapContainer}>
			<GoogleMapReact
				bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
				defaultZoom={currentZoom}
				defaultCenter={{ lat: 60.18, lng: 24.82 }}
				yesIWantToUseGoogleMapApiInternals
				onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
				onChange={(event) => {
					setCurrentZoom(event.zoom);
					fetchImagesInBounds({
						north: event.bounds.ne.lat,
						east: event.bounds.ne.lng,
						south: event.bounds.sw.lat,
						west: event.bounds.sw.lng,
					});
				}}
				onClick={(coord) => {
					const { lat, lng } = coord;
					props.setLocation({ lat, lng });

					props.setAreaImages(
						props.data.mapImages.filter(
							(image) =>
								getDistanceFromLatLonInKm(image.lat, image.lng, lat, lng) < 0.5
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
					<MapMarker lat={marker.lat} lng={marker.lng} key={i} />
				))}
				{props.data.location && props.showCircle && (
					<SearchArea
						lat={props.data.location.lat}
						lng={props.data.location.lng}
						pixels={meters2ScreenPixels(
							1000,
							{
								lat: props.data.location.lat,
								lng: props.data.location.lng,
							},
							currentZoom
						)}
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
