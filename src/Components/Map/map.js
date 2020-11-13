import React, { useEffect } from 'react';
import { connect } from 'react-redux';
//import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import GoogleMapReact, { meters2ScreenPixels } from 'google-map-react';
import { makeStyles } from '@material-ui/core/styles';
import useSupercluster from 'use-supercluster';
import { withFirebase } from '../Firebase';

import { setAreaImages, setLocation } from '../../redux/actions/dataActions';
import MapMarker from './MapMarker';
import SearchArea from './SearchArea';
import FollowedArea from './FollowedArea';

import { getDistanceFromLatLonInKm } from '../../utils';

const useStyles = makeStyles((theme) => ({
	mapContainer: {
		width: '100%',
		height: 'calc(100vh - 64px)', // Offset by appbar height
		[theme.breakpoints.only('xs')]: {
			height: 'calc(100vh - 56px)', // Offset by appbar height
		},
	},
}));

const MapContainer = ({ bounds, fetchImagesInBounds, ...props }) => {
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

	const handleOpenSidePanel = (lat, lng) => {
		props.setLocation({ lat, lng });

		props.setAreaImages(
			props.data.mapImages
				.map((image) => ({
					...image,
					distance: getDistanceFromLatLonInKm(image.lat, image.lng, lat, lng),
				}))
				.filter((image) => image.distance < 0.5)
				.sort((a, b) => a.distance - b.distance)
		);
		props.openSidePanel();
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
					props.setBounds({
						north: event.bounds.ne.lat,
						east: event.bounds.ne.lng,
						south: event.bounds.sw.lat,
						west: event.bounds.sw.lng,
					});
				}}
				onClick={(coord) => {
					if (props.data.followingLocations.length === 0) {
						const { lat, lng } = coord;
						handleOpenSidePanel(lat, lng);
					}
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
								handleClickMarker={handleOpenSidePanel}
							/>
						);
					}

					return (
						<MapMarker
							key={`img-${i}`}
							lat={lat}
							lng={lng}
							handleClickMarker={handleOpenSidePanel}
						/>
					);
				})}
				{props.data.followingLocations.length === 0 && props.data.location && props.showCircle && (
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
						color={'#B1DFFB'}
					/>
				)}
				{props.data.followingLocations &&
					props.data.followingLocations.map((location) => {
						console.log("location", location);
						return (
							<FollowedArea
								lat={location.latitude}
								lng={location.longitude}
								pixels={meters2ScreenPixels(
									1000,
									{
										lat: location.latitude,
										lng: location.longitude,
									},
									currentZoom
								)}
								color={'green'}
								openSidePanel={handleOpenSidePanel}
							/>
						)
					})
				}
			</GoogleMapReact>
		</div>
	);
};

const mapStateToProps = (state) => ({
	data: state.data,
});

const mapActionsToProps = {
	setAreaImages,
	setLocation,
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(withFirebase(MapContainer));
