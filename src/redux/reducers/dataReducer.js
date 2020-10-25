import { SET_LOCATION, SET_MAP_IMAGES, SET_AREA_IMAGES } from '../types';

const initialState = {
	location: null,
	mapImages: [],
	areaImages: [],
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_LOCATION: {
			return {
				...state,
				location: action.payload.location,
			};
		}
		case SET_MAP_IMAGES: {
			return {
				...state,
				mapImages: action.payload.images,
			};
		}
		case SET_AREA_IMAGES: {
			return {
				...state,
				areaImages: action.payload.images,
			};
		}
		default:
			return state;
	}
}
