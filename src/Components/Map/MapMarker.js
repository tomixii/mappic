import React from 'react';
import Typography from '@material-ui/core/Typography';

const MapMarker = ({ lat, lng, count, nofImages }) => {
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
		>
			{count && (
				<div onClick={() => {}}>
					<Typography>{count}</Typography>
				</div>
			)}
		</div>
	);
};

export default MapMarker;
