import React from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';

import L from 'leaflet';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import MarkerLeaflet from './MarkerLeaflet';
import SearchAreaLeaflet from './SearchAreaLeaflet';
import FollowedAreaLeaflet from './FollowedAreaLeaflet';
import { setAreaImages, setLocation } from '../../redux/actions/dataActions';
import { getDistanceFromLatLonInKm } from '../../utils';

const MapEvents = ({ data, handleOpenSidePanel, setZoom, setBounds }) => {
	const map = useMapEvents({
		click: (event) => {
			if (data.followingLocations.length === 0) {
				const { lat, lng } = event.latlng;
				handleOpenSidePanel(lat, lng);
			}
		},
		moveend: (event) => {
			setZoom(map.getZoom());
			setBounds({
				north: map.getBounds()._northEast.lat,
				east: map.getBounds()._northEast.lng,
				south: map.getBounds()._southWest.lat,
				west: map.getBounds()._southWest.lng,
			});
		},
		load: () => {
			// This should work but it doesn't. React.useEffect is used instead
			console.log('map load');
		},
	});
	React.useEffect(() => {
		setZoom(map.getZoom());
		setBounds({
			north: map.getBounds()._northEast.lat,
			east: map.getBounds()._northEast.lng,
			south: map.getBounds()._southWest.lat,
			west: map.getBounds()._southWest.lng,
		});
	}, [setZoom, setBounds]);

	return null;
};

const createClusterCustomIcon = function (cluster) {
	return L.divIcon({
		html: `<span>${cluster.getChildCount()}</span>`,
		className: 'marker-cluster-custom',
		iconSize: L.point(40, 40, true),
	});
};

const Map = ({ bounds, fetchImagesInBounds, ...props }) => {
	const [currentZoom, setCurrentZoom] = React.useState(14);

	React.useEffect(() => {
		if (bounds.north) fetchImagesInBounds(bounds);
	}, [bounds, fetchImagesInBounds]);

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
		<MapContainer
			center={[60.18, 24.82]}
			zoom={currentZoom}
			zoomControl={false}
		>
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{/*
			<OfflineTileLayer />
  */}

			<MapEvents
				handleOpenSidePanel={handleOpenSidePanel}
				setZoom={setCurrentZoom}
				{...props}
			/>
			<MarkerClusterGroup
				showCoverageOnHover={false}
				iconCreateFunction={createClusterCustomIcon}
			>
				{props.data.mapImages.map((img, i) => {
					return <MarkerLeaflet key={i} location={[img.lat, img.lng]} />;
				})}
			</MarkerClusterGroup>

			{props.data.followingLocations.length === 0 &&
				props.data.location &&
				props.showCircle && (
					<SearchAreaLeaflet
						location={[props.data.location.lat, props.data.location.lng]}
						color={'#B1DFFB'}
					/>
				)}
			{props.data.followingLocations &&
				props.data.followingLocations.map((location, i) => {
					return (
						<FollowedAreaLeaflet
							key={i}
							location={[location.latitude, location.longitude]}
							openSidePanel={handleOpenSidePanel}
						/>
					);
				})}
		</MapContainer>
	);
};

const mapStateToProps = (state) => ({
	data: state.data,
});

const mapActionsToProps = {
	setAreaImages,
	setLocation,
};

export default connect(mapStateToProps, mapActionsToProps)(withFirebase(Map));
