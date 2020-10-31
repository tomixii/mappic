import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import PanoramaIcon from '@material-ui/icons/Panorama';

import { setLocation } from '../redux/actions/dataActions';
import { withFirebase } from "./Firebase";

const drawerWidth = 400; // TODO something not fixed?
const useStyles = makeStyles((theme) => ({
	drawer: {
		width: '40%',
		maxWidth: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		marginTop: '64px', // App bar height
		width: '40%',
		maxWidth: drawerWidth,
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '27%',
		backgroundColor: '#E5E5E5',
	},
	placeholderImage: {
		fontSize: '8rem',
		color: theme.palette.grey[400],
	},
	closeButton: {
		position: 'absolute',
		top: 15,
		right: 12,
		color: 'white',
		backgroundColor: 'rgba(0, 0, 0, 0.10)',
	},
	drawerSection: {
		padding: theme.spacing(3),
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	horizontalDrawerSection: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	sectionTitle: {
		fontSize: '1.1em',
		fontWeight: 500,
		marginBottom: theme.spacing(1),
	},
	viewMoreButton: {
		alignSelf: 'center',
		marginTop: theme.spacing(2),
	},
	gridContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
		width: '100%',
		padding: theme.spacing(1, 0),
	},
	gridList: {
		width: '100%',
		padding: 0,
	},
	avatar: {
		width: '100%',
		height: '100%',
	},
	avatarIcon: {
		fontSize: '2.5em',
	},
}));

const SidePanel = (props) => {
	const classes = useStyles();
	//const theme = useTheme();

/*
axios.post("https://fcm.googleapis.com/fcm/send", {"notification": {
        "title": "Firebase",
        "body": "Firebase is awesome",
        "click_action": "http://localhost:3000/",
        "icon": "http://url-to-an-icon/icon.png"
    },
    "to": "USER TOKEN"}).then((res)=> consol.log(res)).catch(err => console.log(err))
 */

	const askForPermissioToReceiveNotifications = async () => {
		try {
			const messaging = props.firebase.messaging;
			await messaging.requestPermission();
			const token = await messaging.getToken();
			console.log('user token:', token);

			return token;
		} catch (error) {
			console.error(error);
		}
	}
	return (
		<Drawer
			className={classes.drawer}
			variant="persistent"
			anchor="left"
			open={props.open}
			classes={{
				paper: classes.drawerPaper,
			}}
		>
			<Box className={classes.drawerHeader}>
				{props.data.areaImages.length > 0 ? (
					<img src={props.data.areaImages[0].imageUrl} alt="thumbnail" />
				) : (
					<PanoramaIcon className={classes.placeholderImage} />
				)}
				<IconButton className={classes.closeButton} onClick={props.handleClose}>
					<CloseIcon />
				</IconButton>
			</Box>
			<Divider />
			<Box className={classes.drawerSection}>
				<Typography className={classes.sectionTitle}>
					{props.locationName}
				</Typography>
				<Typography>{props.locationInfo}</Typography>
			</Box>
			<Divider />
			<Box
				className={clsx(classes.drawerSection, classes.horizontalDrawerSection)}
			>
				<Button
					className={classes.drawerButton}
					variant="contained"
					disableElevation
					color="primary"
					onClick={props.openAddImageModal}
				>
					Add image
				</Button>
				<Button
					className={classes.drawerButton}
					variant="contained"
					disableElevation
					color="primary"
					onClick={() => askForPermissioToReceiveNotifications()}
				>
					Request images
				</Button>
			</Box>
			<Divider />
			<Box className={classes.drawerSection}>
				<Typography className={classes.sectionTitle}>Images</Typography>
				<Box className={classes.gridContainer}>
					<GridList cellHeight={120} className={classes.gridList} cols={3}>
						{props.data.areaImages.map((image, i) => (
							<GridListTile key={i}>
								<Avatar className={classes.avatar} variant="square">
									<img src={image.imageUrl} alt="thumbnail" />
								</Avatar>
							</GridListTile>
						))}
					</GridList>
				</Box>
				<Button className={classes.viewMoreButton} color="primary">
					View more...
				</Button>
			</Box>
		</Drawer>
	);
};

const mapStateToProps = (state) => ({
	data: state.data,
});

const mapActionsToProps = {
	setLocation,
};

export default connect(mapStateToProps, mapActionsToProps)(withFirebase(SidePanel));
