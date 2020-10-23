import { SET_LOCATION, SET_MAP_IMAGES, SET_AREA_IMAGES } from '../types';

export const setLocation = (location) => (dispatch) => {
	dispatch({
		type: SET_LOCATION,
		payload: {
			location,
		},
	});
};

export const setMapImages = (images) => (dispatch) => {
	dispatch({
		type: SET_MAP_IMAGES,
		payload: {
			images,
		},
	});
};
export const setAreaImages = (images) => (dispatch) => {
	dispatch({
		type: SET_AREA_IMAGES,
		payload: {
			images,
		},
	});
};
