import React from 'react';

const SearchArea = (props) => {
	return (
		<div
			style={{
				position: 'absolute',
				transform: 'translate(-50%, -50%)',
				opacity: 0.3,
				width: props.pixels.w,
				height: props.pixels.h,
				borderWidth: 3,
				borderColor: '#186fd6',
				borderStyle: 'solid',
				borderRadius: props.pixels.w * 3,
				backgroundColor: '#B1DFFB',
			}}
		/>
	);
};
export default SearchArea;
