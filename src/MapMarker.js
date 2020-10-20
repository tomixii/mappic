import React from 'react';

const MapMarker = ({ data }) => {
	return (
		<div
			lat={data.lat}
			lng={data.lng}
			style={{
				width: 20,
				height: 20,
				borderWidth: 3,
				borderColor: 'red',
				borderStyle: 'solid',
				borderRadius: 20,
				backgroundColor: 'lightblue',
			}}
		/>
	);
};

export default MapMarker;
