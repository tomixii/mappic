import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import IconButton from '@material-ui/core/IconButton';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles, withStyles } from '@material-ui/core/styles';
import { useDropzone } from 'react-dropzone';
import { withFirebase } from './Firebase';
import { BrowserView, MobileView } from 'react-device-detect';

import CloseIcon from '@material-ui/icons/Close';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';

import { getDistanceFromLatLonInKm } from '../utils';

const useStyles = makeStyles((theme) => ({
	footerButton: {
		marginRight: theme.spacing(0.5),
	},
	box: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.spacing(4),
		margin: theme.spacing(3, 0),
		border: '3px dashed #E5E5E5',
		'&:focus': {
			outline: 'none',
			border: '3px dashed #BDBDBD',
		},
		[theme.breakpoints.down('sm')]: {
			padding: theme.spacing(2),
		},
	},
	uploadIcon: {
		fontSize: '3.5rem',
		margin: theme.spacing(3, 3, 1, 3),
		color: theme.palette.grey[400],
	},
	uploadText: {
		margin: theme.spacing(1, 3, 3, 3),
	},
	gridListContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
		margin: theme.spacing(3, 0, 0, 0),
	},
	gridList: {
		width: '100%',
	},
	image: {
		objectFit: 'cover',
	},
}));

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
		backgroundColor: theme.palette.primary.main,
		color: 'white',
		display: 'flex',
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: 'white',
	},
});

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h6">{children}</Typography>
			{props.onClose ? (
				<IconButton className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

const DialogContent = withStyles((theme) => ({
	root: {
		padding: theme.spacing(3),
		paddingTop: theme.spacing(3.5),
		paddingBottom: theme.spacing(3.5),
	},
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
}))(MuiDialogActions);

const AddImageModal = (props) => {
	const classes = useStyles();
	const theme = useTheme();
	const [files, setFiles] = React.useState([]);

	const { getRootProps, getInputProps } = useDropzone({
		accept: 'image/*',
		onDrop: (acceptedFiles) => {
			setFiles(
				acceptedFiles.map((file) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					})
				)
			);
		},
	});

	// Use full screen dialog for smaller screens
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const screenLarge = useMediaQuery(theme.breakpoints.up('lg'));
	const screenMedium = useMediaQuery(theme.breakpoints.only('md'));
	const screenSmall = useMediaQuery(theme.breakpoints.only('sm'));
	const screenExtraSmall = useMediaQuery(theme.breakpoints.only('xs'));

	const columns = () => {
		if (screenLarge) {
			return 5;
		} else if (screenMedium) {
			return 4;
		} else if (screenSmall) {
			return 3;
		} else if (screenExtraSmall) {
			return 2;
		} else {
			return 3;
		}
	};

	const thumbs = files.map((file) => (
		<GridListTile key={file.name} cols={1}>
			<img className={classes.image} src={file.preview} alt={file.name} />
		</GridListTile>
	));

	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks
		files.forEach((file) => URL.revokeObjectURL(file.preview));
	}, [files]);

	const sendNotifications = () => {
		props.firebase
			.users()
			.get()
			.then((data) => {
				data.forEach((doc) => {
					doc.data().locations.forEach((loc) => {
						if (
							getDistanceFromLatLonInKm(
								props.data.location.lat,
								props.data.location.lng,
								loc.latitude,
								loc.longitude
							) < 0.5
						) {
							const to = doc.id;
							const notification = {
								title: 'Checkout new image!',
								body: `Image added near your followed location: ${loc.latitude},${loc.longitude}`,
								icon: 'logo192.png',
								click_action: 'https://mappic.web.app',
							};
							fetch('https://fcm.googleapis.com/fcm/send', {
								method: 'POST',
								headers: {
									Authorization:
										'key=' + process.env.REACT_APP_MESSAGE_SERVER_KEY,
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({
									notification: notification,
									to: to,
								}),
							})
								.then(function (response) {
									console.log(response);
								})
								.catch(function (error) {
									console.error(error);
								});
						}
					});
				});
			});
	};

	return (
		<Dialog fullWidth maxWidth={'md'} fullScreen={fullScreen} open={props.open}>
			<DialogTitle onClose={props.handleClose}>Add image</DialogTitle>
			<DialogContent dividers>
				<BrowserView>
					<Button
						{...getRootProps({ className: 'dropzone' })}
						variant="outlined"
					>
						Choose image
					</Button>

					<div
						{...getRootProps({ className: 'dropzone' })}
						className={classes.box}
					>
						<input {...getInputProps()} />
						<VerticalAlignTopIcon className={classes.uploadIcon} />
						<Typography className={classes.uploadText}>
							Choose an image or drag and drop it here
						</Typography>
					</div>
					{thumbs && (
						<div className={classes.gridListContainer}>
							<GridList
								cellHeight={145}
								className={classes.gridList}
								cols={columns()}
							>
								{thumbs}
							</GridList>
						</div>
					)}
				</BrowserView>
				<MobileView>
					<Button
						{...getRootProps({ className: 'dropzone' })}
						variant="outlined"
					>
						Choose image
					</Button>
					<input {...getInputProps()} />
					{thumbs && (
						<div className={classes.gridListContainer}>
							<GridList
								cellHeight={145}
								className={classes.gridList}
								cols={columns()}
							>
								{thumbs}
							</GridList>
						</div>
					)}
				</MobileView>
			</DialogContent>

			<DialogActions>
				<Button
					variant="contained"
					disableElevation
					color="primary"
					className={classes.footerButton}
					onClick={() => {
						props.handlePictures(files);
						sendNotifications();
						setFiles([]);
						/* TODO: Tell to users that "pictures(s) added successfully" */
						props.handleClose();
					}}
				>
					Add
				</Button>
				<Button
					variant="outlined"
					onClick={() => {
						setFiles([]);
						props.handleClose();
					}}
				>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const mapStateToProps = (state) => ({
	data: state.data,
});

export default connect(mapStateToProps, null)(withFirebase(AddImageModal));
