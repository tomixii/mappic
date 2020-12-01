import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { withFirebase } from '../Components/Firebase';
import { connect } from 'react-redux';
import { setFollowingLocations } from '../redux/actions/dataActions';

const useStyles = makeStyles((theme) => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	title: {
		flexGrow: 1,
		textAlign: 'start',
	},
}));

const Header = (props) => {
	const classes = useStyles();
	const [showFollowedLocation, setShowFollowedLocation] = React.useState(false);

	return (
		<AppBar className={classes.appBar} position="static">
			<Toolbar>
				<Typography variant="h6" className={classes.title}>
					Mappic
				</Typography>
				{/* TODO uncomment if authentication is implemented
                <Button color='inherit'>Login</Button>
            */}
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
												props.setFollowingLocations(doc.data().locations);
											} else {
												// doc.data() will be undefined in this case
												console.log('No such document!');
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
