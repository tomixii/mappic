import React from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';

import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import MarkerLeaflet from './MarkerLeaflet';
import SearchAreaLeaflet from './SearchAreaLeaflet';
import FollowedAreaLeaflet from './FollowedAreaLeaflet';
import { setAreaImages, setLocation } from '../../redux/actions/dataActions';
import { getDistanceFromLatLonInKm } from '../../utils';

const MapEvents = (props) => {
	React.useEffect(() => {
		props.setZoom(map.getZoom());
		props.setBounds({
			north: map.getBounds()._northEast.lat, // event.bounds.ne.lat,
			east: map.getBounds()._northEast.lng, //event.bounds.ne.lng,
			south: map.getBounds()._southWest.lat, //event.bounds.sw.lat,
			west: map.getBounds()._southWest.lng, // event.bounds.sw.lng,
		});
	}, []);

	const map = useMapEvents({
		click: (event) => {
			if (props.data.followingLocations.length === 0) {
				const { lat, lng } = event.latlng;
				props.handleOpenSidePanel(lat, lng);
			}
		},
		moveend: (event) => {
			props.setZoom(map.getZoom());
			props.setBounds({
				north: map.getBounds()._northEast.lat,
				east: map.getBounds()._northEast.lng,
				south: map.getBounds()._southWest.lat,
				west: map.getBounds()._southWest.lng,
			});
		},
	});
	return null;
};

const Map = ({ bounds, fetchImagesInBounds, ...props }) => {
	const [currentZoom, setCurrentZoom] = React.useState(14);

	React.useEffect(() => {
		if (bounds.north) fetchImagesInBounds(bounds);
	}, [bounds]);

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
		<MapContainer center={[60.18, 24.82]} zoom={currentZoom}>
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<MapEvents
				handleOpenSidePanel={handleOpenSidePanel}
				setZoom={setCurrentZoom}
				{...props}
			/>
			<MarkerClusterGroup>
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
