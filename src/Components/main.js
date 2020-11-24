import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import MuiAlert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';

import AddImageModal from './addImageModal';
import ImageGallery from './ImageGallery';
import Map from './Map/map';
import SidePanel from './locationView';
import { withFirebase } from './Firebase';
import {
	setAreaImages,
	setMapImages,
	setLocation,
} from '../redux/actions/dataActions';
import { getDistanceFromLatLonInKm } from '../utils';

const drawerWidth = 450;

function Alert(props) {
	return <MuiAlert elevation={3} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
	container: {
		position: 'relative',
		top: 0,
		padding: 0,
		maxWidth: 'none',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	content: {
		display: 'flex',
		width: '100%',
		marginLeft: 0,
	},
	buttonContainer: {
		position: 'absolute',
		left: '50%',
		transform: 'translateX(-50%)',
		bottom: theme.spacing(4),
	},
	buttonContainerShift: {
		// TODO can button be centered?
	},
	snackbar: {
		top: 74, // 64 (Appbar height) + 10
		[theme.breakpoints.only('xs')]: {
			top: 66, // 56 (Appbar height) + 10
		},
	},
}));

const Main = (props) => {
	const classes = useStyles();
	const [alert, setAlert] = React.useState({ severity: '', message: '' });
	const [openSnackbar, setOpenSnackbar] = React.useState(false);
	const [openModal, setOpenModal] = React.useState(false);
	const [openSidePanel, setOpenSidePanel] = React.useState(false);
	const [openImageGallery, setOpenImageGallery] = React.useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
	const [bounds, setBounds] = React.useState({});

	const handleClickOpenModal = () => {
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleClickOpenSidePanel = () => {
		setOpenSidePanel(true);
	};

	const handleCloseSidePanel = () => {
		setOpenSidePanel(false);
	};

	const handleOpenImageGallery = (selectedImageIndex) => {
		setSelectedImageIndex(selectedImageIndex);
		setOpenImageGallery(true);
	};

	const handleCloseImageGallery = () => {
		setOpenImageGallery(false);
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpenSnackbar(false);
	};

	const handlePictures = (files) => {
		files.forEach((file) => {
			const imageExtension = file.path.split('.')[
				file.path.split('.').length - 1
			];
			//234124124.png
			const imageFileName = `${Math.round(
				Math.random() * 100000000
			)}.${imageExtension}`;
			props.firebase.storage
				.ref(`images/${imageFileName}`)
				.put(file)
				.then(() => {
					props.firebase
						.pictures()
						.add({
							lat: props.data.location.lat,
							lng: props.data.location.lng,
							imageUrl:
								'https://firebasestorage.googleapis.com/v0/b/mappic.appspot.com/o/images%2F' +
								imageFileName +
								'?alt=media',
							createdAt: new Date().toISOString(),
						})
						.then(function (docRef) {
							const { lat, lng } = props.data.location;
							fetchImagesInBounds(bounds).then((images) => {
								props.setAreaImages(
									images.filter(
										(image) =>
											getDistanceFromLatLonInKm(
												image.lat,
												image.lng,
												lat,
												lng
											) < 0.5
									)
								);
							});
							const message =
								files.length > 1
									? 'Images uploaded successfully!'
									: 'Image uploaded successfully!';
							setAlert({ severity: 'success', message: message });
							setOpenSnackbar(true);
							console.log('Document written with ID: ', docRef.id);
						})
						.catch(function (error) {
							const message =
								files.length > 1
									? 'Could not upload images'
									: 'Could not upload image';
							setAlert({ severity: 'error', message: message });
							setOpenSnackbar(true);
							console.error('Error adding document: ', error);
						});
				});
		});
	};

	const fetchImagesInBounds = (bounds) => {
		const images = [];
		return props.firebase
			.pictures()
			.where('lat', '<', bounds.north)
			.where('lat', '>', bounds.south)
			.get()
			.then((data) => {
				data.forEach((doc) => {
					if (doc.data().lng > bounds.west && doc.data().lng < bounds.east) {
						images.push(doc.data());
					}
				});
			})
			.then(() => {
				//console.log(images);
				props.setMapImages(images);
				return images;
				//console.log(`Saved ${images.length} image(s) to redux`);
			});
	};

	return (
		<Container className={classes.container}>
			<SidePanel
				drawerWidth={drawerWidth}
				open={openSidePanel}
				handleClose={handleCloseSidePanel}
				openAddImageModal={() => handleClickOpenModal()}
				openImageGallery={handleOpenImageGallery}
				setAlert={setAlert}
				setOpenSnackbar={setOpenSnackbar}
			/>
			<AddImageModal
				open={openModal}
				handleClose={handleCloseModal}
				handlePictures={handlePictures}
			/>
			<ImageGallery
				selectedItem={selectedImageIndex}
				open={openImageGallery}
				handleClose={handleCloseImageGallery}
			/>
			<main className={classes.content}>
				<Map
					bounds={bounds}
					setBounds={setBounds}
					fetchImagesInBounds={fetchImagesInBounds}
					openSidePanel={() => handleClickOpenSidePanel()}
					showCircle={openSidePanel}
				/>
				<Box
					className={clsx(classes.buttonContainer, {
						[classes.buttonContainerShift]: openSidePanel,
					})}
				>
					<Fab
						size="medium"
						variant="extended"
						color="primary"
						onClick={() => {
							navigator.geolocation.getCurrentPosition((position) => {
								props.setLocation({
									lng: position.coords.longitude,
									lat: position.coords.latitude,
								});
							});
							handleClickOpenModal();
						}}
						className={classes.fab}
					>
						Add image here
					</Fab>
				</Box>
			</main>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={openSnackbar}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				className={classes.snackbar}
			>
				<Alert severity={alert.severity} onClose={handleCloseSnackbar}>
					{alert.message}
				</Alert>
			</Snackbar>
		</Container>
	);
};

const mapStateToProps = (state) => ({
	data: state.data,
});

const mapActionsToProps = {
	setAreaImages,
	setMapImages,
	setLocation,
};

export default connect(mapStateToProps, mapActionsToProps)(withFirebase(Main));
