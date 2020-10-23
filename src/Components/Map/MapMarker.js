import React from 'react';

const MapMarker = ({ lat, lng }) => {
	return (
		<div
			lat={lat}
			lng={lng}
			style={{
				width: 20,
				height: 20,
				borderWidth: 3,
				borderColor: 'red',
				borderStyle: 'solid',
				borderRadius: 20,
				backgroundColor: 'lightblue',
				position: 'absolute',
				top: -13,
				left: -13,
			}}
		/>
	);
};

export default MapMarker;
