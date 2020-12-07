import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { withFirebase } from '../Components/Firebase';
import { connect } from 'react-redux';
import { setFollowingLocations } from '../redux/actions/dataActions';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Slide,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	title: {
		flexGrow: 1,
		textAlign: 'start',
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const Header = (props) => {
	const classes = useStyles();
	const [showFollowedLocation, setShowFollowedLocation] = React.useState(false);
	const [dialogOpen, setDialogOpen] = React.useState(false);

	const handleOpenDialog = () => {
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
	};
	return (
		<AppBar className={classes.appBar} position="static">
			<Toolbar>
				<Typography variant="h6" className={classes.title}>
					Mappic
				</Typography>
				<Button
					color="inherit"
					onClick={() => {
						if (props.data.followingLocations.length === 0) {
							props.firebase.messaging
								.getToken({
									vapidKey:
										'BBtRGGPWogpmWdmdnqpq8IQouLEwsG8iiu6r3LXHuDYvFhtDJwyRp06VlKMhDbGUCsGMJtuCYKlcm28Z4pk7duQ',
								})
								.then((token) => {
									props.firebase
										.users()
										.doc(token)
										.get()
										.then((doc) => {
											if (doc.exists) {
												if (doc.data().locations.length > 0) {
													props.setFollowingLocations(doc.data().locations);
												} else {
													handleOpenDialog();
												}
											} else {
												// doc.data() will be undefined in this case
												console.log('No such document!');
												handleOpenDialog();
											}
										});
								})
								.catch((err) => console.log(err));
						} else {
							props.setFollowingLocations([]);
						}
						setShowFollowedLocation(!showFollowedLocation);
					}}
				>
					{props.data.followingLocations.length > 0
						? 'hide followed'
						: 'show followed'}
				</Button>
			</Toolbar>
			<Dialog
				open={dialogOpen}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseDialog}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle id="alert-dialog-slide-title">
					You don't follow any locations yet.
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						Select a location from the map and follow it to get notifications of
						new images!
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary">
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</AppBar>
	);
};

const mapStateToProps = (state) => ({
	data: state.data,
});

const mapActionsToProps = {
	setFollowingLocations,
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(withFirebase(Header));
