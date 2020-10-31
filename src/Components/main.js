import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';

import AddImageModal from './addImageModal';
import Map from './Map/map';
import SidePanel from './locationView';
import { withFirebase } from './Firebase';
import { setLocation } from '../redux/actions/dataActions';

const drawerWidth = 450;

const useStyles = makeStyles((theme) => ({
	container: {
		padding: 0,
		height: '100%',
		maxWidth: 'none',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center'
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
}));

const Main = (props) => {
	const classes = useStyles();
	const [openModal, setOpenModal] = React.useState(false);
	const [openSidePanel, setOpenSidePanel] = React.useState(false);

	const handleClickOpenModal = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			console.log(position);
			props.setLocation({
				lng: position.coords.longitude,
				lat: position.coords.latitude,
			});
		});

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

	return (
		<Container className={classes.container}>
			<SidePanel
				locationName="Example location"
				locationInfo="Other location info"
				drawerWidth={drawerWidth}
				open={openSidePanel}
				handleClose={handleCloseSidePanel}
				openAddImageModal={() => setOpenModal(true)}
			/>
			<AddImageModal open={openModal} handleClose={handleCloseModal} />

			<main
				className={classes.content}
			>
				<Map
					openSidePanel={() => setOpenSidePanel(true)}
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
						onClick={() => handleClickOpenModal()}
						className={classes.fab}
					>
						Add image here
					</Fab>
				</Box>
			</main>
		</Container>
	);
};

const mapActionsToProps = {
	setLocation,
};

export default connect(null, mapActionsToProps)(withFirebase(Main));
