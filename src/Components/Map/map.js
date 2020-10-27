import React, { useEffect } from 'react';
import { connect } from 'react-redux';
//import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import GoogleMapReact, { meters2ScreenPixels } from 'google-map-react';
import { makeStyles } from '@material-ui/core/styles';
import useSupercluster from 'use-supercluster';
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
		height: 'calc(100vh - 56px)', // Offset by appbar height
		[theme.breakpoints.up('md')]: {
			height: 'calc(100vh - 64px)' // Offset by appbar height
		}
	},
}));

const MapContainer = (props) => {
	const classes = useStyles();

	//const [markers, setMarkers] = React.useState([]);
	const [currentZoom, setCurrentZoom] = React.useState(14);
	const [bounds, setBounds] = React.useState({});

	const handleApiLoaded = (map, maps) => {
		fetchImagesInBounds({
			north: map.getBounds().Ya.j,
			east: map.getBounds().Sa.j,
			south: map.getBounds().Ya.i,
			west: map.getBounds().Sa.i,
		});
	};
	useEffect(() => {
		if (bounds.north) fetchImagesInBounds(bounds);
	}, [bounds]);

	const { clusters, supercluster } = useSupercluster({
		points: props.data.mapImages.map((img) => ({
			type: 'Feature',
			properties: { cluster: false, ...img },
			geometry: {
				type: 'Point',
				coordinates: [parseFloat(img.lng), parseFloat(img.lat)],
			},
		})),
		bounds: [bounds.west, bounds.south, bounds.east, bounds.north],
		zoom: currentZoom,
		options: { radius: 75, maxZoom: 20 },
	});

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
				//console.log(images);
				props.setMapImages(images);
				//console.log(`Saved ${images.length} image(s) to redux`);
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
					setBounds({
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
				{clusters.map((cluster, i) => {
					const [lng, lat] = cluster.geometry.coordinates;
					const {
						cluster: isCluster,
						point_count: pointCount,
					} = cluster.properties;

					if (isCluster) {
						return (
							<MapMarker
								key={`cluster-${cluster.id}`}
								lat={lat}
								lng={lng}
								count={pointCount}
								nofImages={props.data.mapImages}
							></MapMarker>
						);
					}

					return <MapMarker key={`img-${i}`} lat={lat} lng={lng} />;
				})}
				{false &&
					props.data.mapImages.map((marker, i) => (
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
