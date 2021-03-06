import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import PanoramaIcon from '@material-ui/icons/Panorama';
import { isMobile } from 'react-device-detect';

import { setLocation, setFollowingLocations } from '../redux/actions/dataActions';
import { withFirebase } from './Firebase';

const drawerWidth = 400; // TODO something not fixed?
const useStyles = makeStyles((theme) => ({
	drawer: {
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '40%',
			maxWidth: drawerWidth,
		},
		flexShrink: 0,
	},
	drawerPaper: {
		width: '100%',
		marginTop: '64px',
		[theme.breakpoints.up('md')]: {
			width: '40%',
			maxWidth: drawerWidth,
		},
		[theme.breakpoints.only('xs')]: {
			marginTop: '56px',
		},
	},
	drawerHeader: {
		height: '33%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#E5E5E5',
		[theme.breakpoints.down('xs')]: {
			height: '33%',
		},
		[theme.breakpoints.up('md')]: {
			height: '30%',
		},
	},
	headerImageContainer: {
		width: '100%',
		height: '100%',
		transition: '0.3s ease',
		'&:hover': {
			cursor: 'pointer',
			opacity: 0.7,
		},
		overflow: 'hidden',
		background: 'black',
	},
	placeholderImage: {
		fontSize: '8rem',
		color: theme.palette.grey[400],
	},
	closeButton: {
		position: 'absolute',
		top: 15,
		right: 12,
		[theme.breakpoints.down('xs')]: {
			top: 10,
			right: 10,
		},
		color: 'white',
		backgroundColor: 'rgba(0, 0, 0, 0.10)',
		'&:hover': {
			backgroundColor: 'rgba(0, 0, 0, 0.20)',
		},
	},
	backButton: {
		position: 'absolute',
		top: 15,
		left: 12,
		[theme.breakpoints.down('xs')]: {
			top: 10,
			left: 10,
		},
		color: 'white',
		backgroundColor: 'rgba(0, 0, 0, 0.10)',
	},
	drawerSection: {
		padding: theme.spacing(3),
		[theme.breakpoints.down('xs')]: {
			padding: theme.spacing(2, 3),
		},
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	horizontalDrawerSection: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		[theme.breakpoints.up('sm')]: {
			justifyContent: 'center',
		},
		[theme.breakpoints.up('md')]: {
			justifyContent: 'space-around',
		},
	},
	drawerButton: {
		[theme.breakpoints.up('sm')]: {
			margin: theme.spacing(0, 3),
		},
		[theme.breakpoints.up('md')]: {
			margin: 0,
		},
	},
	sectionTitle: {
		fontSize: '1.1em',
		fontWeight: 500,
		marginBottom: theme.spacing(1),
		[theme.breakpoints.down('xs')]: {
			fontSize: '1em',
			marginBottom: theme.spacing(0.5),
		},
	},
	viewMoreButton: {
		alignSelf: 'center',
		marginTop: theme.spacing(2),
		[theme.breakpoints.down('xs')]: {
			marginTop: theme.spacing(1),
		},
	},
	gridContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		width: '100%',
		padding: theme.spacing(1, 0),
	},
	gridList: {
		width: '100%',
		padding: 0,
	},
	gridListTile: {
		transition: '0.3s ease',
		'&:hover': {
			cursor: 'pointer',
			opacity: 0.7,
		},
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		top: '50%',
		position: 'relative',
		transform: 'translateY(-50%)',
	},
}));

const SidePanel = (props) => {
	const classes = useStyles();
	const theme = useTheme();

	const [loading, setLoading] = React.useState(false);

	const screenSmall = useMediaQuery(theme.breakpoints.only('sm'));
	const screenExtraSmall = useMediaQuery(theme.breakpoints.only('xs'));

	const columns = () => {
		if (screenSmall) {
			return 4;
		} else {
			return 3;
		}
	};

	const previewImages = screenSmall
		? props.data.areaImages.slice(0, 4)
		: props.data.areaImages.slice(0, 3);

	const askForPermissioToReceiveNotifications = async () => {
		try {
			const messaging = props.firebase.messaging;
			await messaging.requestPermission();
			const token = await messaging.getToken();
			props.firebase
				.users()
				.doc(token)
				.set(
					{
						locations: props.firebase.firestore.FieldValue.arrayUnion(
							new props.firebase.firestore.GeoPoint(
								props.data.location.lat,
								props.data.location.lng
							)
						),
					},
					{ merge: true }
				)
				.then(() => {
					props.setAlert({
						severity: 'success',
						message: 'Location followed successfully!',
					});
					props.setOpenSnackbar(true);
					console.log('Document written with ID: ', token);
				})
				.catch((error) => {
					props.setAlert({
						severity: 'error',
						message: 'Could not follow location',
					});
					props.setOpenSnackbar(true);
					console.error('Error adding document: ', error);
				});

			return token;
		} catch (error) {
			console.error(error);
		}
	};

	const removeFollowedLocation = async () => {
		try {
			const messaging = props.firebase.messaging;
			await messaging.requestPermission();
			const token = await messaging.getToken();
			let newLocations = [];
			setLoading(true)
			props.firebase.users().doc(token).get().then((doc) => {

				if (doc.exists) {
					newLocations = doc.data().locations.filter((x) => x.longitude !== props.data.location.lng && x.latitude !== props.data.location.lat);
					console.log('Document data:', doc.data());
				} else {
					// doc.data() will be undefined in this case
					console.log('No such document!');
				}
			}).then(() => {
				props.firebase
					.users()
					.doc(token)
					.set(
						{
							locations: newLocations,

						},
						{ merge: true }
					)
					.then(() => {
						props.setFollowingLocations(newLocations);
						setLoading(false)
						props.setAlert({
							severity: 'success',
							message: 'Location followed successfully!',
						});
						props.setOpenSnackbar(true);
						console.log('Document written with ID: ', token);
					})
					.catch((error) => {
						props.setAlert({
							severity: 'error',
							message: 'Could not follow location',
						});
						props.setOpenSnackbar(true);
						console.error('Error adding document: ', error);
					});
			});

			return token;
		} catch (error) {
			console.error(error);
		}

	};

	const isFollowedLocation = () => {
		return props.data.location && props.data.followingLocations.filter(loc => loc.latitude === props.data.location.lat && loc.longitude === props.data.location.lng).length > 0;
	};
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
					<div
						className={classes.headerImageContainer}
						onClick={() => {
							props.openImageGallery(0);
						}}
					>
						<img
							className={classes.image}
							src={props.data.areaImages[0].imageUrl}
							alt="thumbnail"
						/>
					</div>
				) : (
					<PanoramaIcon className={classes.placeholderImage} />
				)}
				{isMobile ? (
					<IconButton
						className={classes.backButton}
						onClick={props.handleClose}
					>
						<ArrowBackIcon />
					</IconButton>
				) : (
					<IconButton
						className={classes.closeButton}
						onClick={props.handleClose}
					>
						<CloseIcon />
					</IconButton>
				)}
			</Box>
			<Divider />
			<Box className={classes.drawerSection}>
				<Typography className={classes.sectionTitle}>
					{`There are ${props.data.areaImages.length} image(s) nearby.`}
				</Typography>
				<Typography>
					{props.data.location &&
						`${
							Math.round((props.data.location.lng + Number.EPSILON) * 100) / 100
						}, ${
							Math.round((props.data.location.lat + Number.EPSILON) * 100) / 100
						}`}
				</Typography>
			</Box>
			<Divider />
			<Box
				className={clsx(classes.drawerSection, classes.horizontalDrawerSection)}
			>
				<Button
					className={classes.drawerButton}
					size={screenExtraSmall ? 'small' : 'medium'}
					variant="contained"
					disableElevation
					color="primary"
					onClick={props.openAddImageModal}
				>
					Add image
				</Button>
				<Button
					className={classes.drawerButton}
					size={screenExtraSmall ? 'small' : 'medium'}
					variant="contained"
					disableElevation
					color="primary"
					onClick={() => {
						if (isFollowedLocation()){
							removeFollowedLocation()
						} else {
							askForPermissioToReceiveNotifications()
						}
					}}
				>

					{!loading ? isFollowedLocation() ? 'Unfollow location' : 'Follow location': 'loading...'}
				</Button>
			</Box>
			<Divider />
			<Box className={classes.drawerSection}>
				<Typography className={classes.sectionTitle}>Images</Typography>
				{props.data.areaImages.length > 0 && (
					<>
						<Box className={classes.gridContainer}>
							<GridList
								cellHeight={screenExtraSmall ? 100 : 120}
								className={classes.gridList}
								cols={columns()}
							>
								{previewImages.map((image, i) => (
									<GridListTile
										className={classes.gridListTile}
										key={i}
										onClick={() => props.openImageGallery(i)}
									>
										<img src={image.imageUrl} alt="thumbnail" />
									</GridListTile>
								))}
							</GridList>
						</Box>
						<Button
							className={classes.viewMoreButton}
							color="primary"
							size={screenExtraSmall ? 'small' : 'medium'}
							onClick={() => {
								props.openImageGallery(0);
							}}
						>
							View images
						</Button>
					</>
				)}
				{props.data.areaImages.length === 0 && (
					<Typography>No images</Typography>
				)}
			</Box>
		</Drawer>
	);
};

const mapStateToProps = (state) => ({
	data: state.data,
});

const mapActionsToProps = {
	setLocation,
	setFollowingLocations,
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(withFirebase(SidePanel));
