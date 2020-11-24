import { SET_LOCATION, SET_MAP_IMAGES, SET_AREA_IMAGES, SET_FOLLOWING_LOCATIONS } from '../types';

const initialState = {
	location: undefined,
	mapImages: [],
	areaImages: [],
	followingLocations: [],
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
		case SET_FOLLOWING_LOCATIONS: {
			return {
				...state,
				followingLocations: action.payload.locations,
			};
		}
		default:
			return state;
	}
}
