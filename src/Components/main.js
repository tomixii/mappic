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

const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
	container: {
		padding: 0,
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	content: {
		display: 'flex',
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: 0,
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: drawerWidth,
	},
	buttonContainer: {
		position: 'absolute',
		left: '50%',
		transform: 'translateX(-50%)',
		bottom: theme.spacing(4),
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonContainerShift: {
		width: `calc(100% - ${drawerWidth}px)`,
	},
	placeholderButton: {
		marginBottom: theme.spacing(10),
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
				className={clsx(classes.content, {
					[classes.contentShift]: openSidePanel,
				})}
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
						className={classes.placeholderButton}
						onClick={() => handleClickOpenSidePanel()}
					>
						{/* TODO: this is a placeholder button for map location*/}
						Open location
					</Fab>
					<Fab
						size="medium"
						variant="extended"
						color="primary"
						onClick={() => handleClickOpenModal()}
						className={classes.fab}
					>
						Add image to my location
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
