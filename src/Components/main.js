import React from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';

import { AddImageModal } from './add-image-modal';
import Map from './map';
import { SidePanel } from './location-view';

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
		bottom: theme.spacing(4),
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	buttonContainerShift: {
		width: `calc(100% - ${drawerWidth}px)`,
	},
	placeholderButton: {
		marginBottom: theme.spacing(10),
	},
}));

const Main = () => {
	const classes = useStyles();
	const [openModal, setOpenModal] = React.useState(false);
	const [openSidePanel, setOpenSidePanel] = React.useState(false);

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

	return (
		<Container className={classes.container}>
			<SidePanel
				images={[]}
				locationName="Example location"
				locationInfo="Other location info"
				drawerWidth={drawerWidth}
				open={openSidePanel}
				handleClose={handleCloseSidePanel}
			/>
			<AddImageModal open={openModal} handleClose={handleCloseModal} />

			<main
				className={clsx(classes.content, {
					[classes.contentShift]: openSidePanel,
				})}
			>
				<Map />
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

export { Main };
