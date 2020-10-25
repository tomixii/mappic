import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles, withStyles } from '@material-ui/core/styles';
import { useDropzone } from 'react-dropzone';
import { withFirebase } from './Firebase';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';

import CloseIcon from '@material-ui/icons/Close';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';

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
		marginTop: theme.spacing(3),
		border: '3px dashed #E5E5E5',
	},
	uploadIcon: {
		fontSize: '3.5rem',
		margin: theme.spacing(3, 3, 1, 3),
		color: theme.palette.grey[400],
	},
	uploadText: {
		margin: theme.spacing(1, 3, 3, 3),
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

	const handlePictures = () => {
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
							console.log('Document written with ID: ', docRef.id);
						})
						.catch(function (error) {
							console.error('Error adding document: ', error);
						});
				});
		});
	};

	// Use full screen dialog for smaller screens
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const thumbs = files.map((file) => (
		<div style={{ display: 'inline-flex' }} key={file.name}>
			<div style={{ display: 'flex' }}>
				<img
					src={file.preview}
					width={isMobile ? '80%' : 100}
					height={isMobile ? '80%' : 100}
				/>
			</div>
		</div>
	));

	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks
		files.forEach((file) => URL.revokeObjectURL(file.preview));
	}, [files]);

	return (
		<Dialog fullScreen={fullScreen} open={props.open}>
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
					{thumbs && <aside>{thumbs}</aside>}
				</BrowserView>
				<MobileView>
					<Button
						{...getRootProps({ className: 'dropzone' })}
						variant="outlined"
					>
						Choose image
					</Button>
					<input {...getInputProps()} />
					{thumbs && <aside>{thumbs}</aside>}
				</MobileView>
			</DialogContent>

			<DialogActions>
				<Button
					variant="contained"
					disableElevation
					color="primary"
					className={classes.footerButton}
					onClick={() => {
						handlePictures();
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
