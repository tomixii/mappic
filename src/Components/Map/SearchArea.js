import React from 'react';

const SearchArea = ({ lat, lng }) => {
	return (
		<div
			lat={lat}
			lng={lng}
			style={{
				position: 'absolute',
				transform: 'translate(-50%, -50%)',
				opacity: 0.3,
				width: 200,
				height: 200,
				borderWidth: 3,
				borderColor: 'red',
				borderStyle: 'solid',
				borderRadius: 100,
				backgroundColor: 'lightblue',
			}}
		/>
	);
};
export default SearchArea;
