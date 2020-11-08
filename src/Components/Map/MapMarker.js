import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: 20,
		height: 20,
		borderWidth: 2.5,
		borderColor: "#186fd6",
		borderStyle: "solid",
		borderRadius: 20,
		backgroundColor: "#B1DFFB",
		position: "absolute",
		top: -13,
		left: -13,
	}
}));

const MapMarker = ({ lat, lng, count, nofImages }) => {
	const classes = useStyles();
	return (
		<div
			lat={lat}
			lng={lng}
			className={classes.container}
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
