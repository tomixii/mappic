import React from 'react';

const FollowedArea = (props) => {
	return (
		<div
			onClick={() => props.openSidePanel(props.lat,props.lng)}
			style={{
				position: 'absolute',
				transform: 'translate(-50%, -50%)',
				opacity: 0.3,
				width: props.pixels.w,
				height: props.pixels.h,
				borderWidth: 3,
				borderColor: props.color,
				borderStyle: 'solid',
				borderRadius: props.pixels.w * 3,
				backgroundColor: props.color,
			}}
		/>
	);
};
export default FollowedArea;
