import React from 'react';
import clsx from 'clsx';

import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import './ImageGallery.css' // override some carousel styles

import { Carousel } from 'react-responsive-carousel';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { isMobile } from 'react-device-detect';


const useStyles = makeStyles((theme) => ({
    dialog: {
        height: '100vh',
    },
    dialogPaper: {
        background: 'black',
    },
    closeButton: {
        position: 'absolute',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.10)',
        zIndex: 1500,
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.10)'
        }
    },
    mobileCloseButton: {
        top: 6,
        left: 10,
        [theme.breakpoints.down('xs')]: {
            top: 10,
            left: 10,
        },
    },
    desktopCloseButton: {
        top: 6,
        right: 10,
        [theme.breakpoints.down('xs')]: {
            top: 10,
            right: 10,
        },
    },
    image: {
        objectFit: 'contain',
        width: '100%',
        height: '100%'
    },
    imageContainer: {
        height: '100vh',
        padding: theme.spacing(8, 0)
    },
}));

const ImagesGallery = (props) => {
    const classes = useStyles();
    const closeButtonClassNames = isMobile
        ? clsx(classes.closeButton, classes.mobileCloseButton)
        : clsx(classes.closeButton, classes.desktopCloseButton);

    return (
        <div>
            <Dialog
                className={classes.dialog}
                PaperProps={{className: classes.dialogPaper}}
                fullScreen
                open={props.open}
                onClose={props.handleClose}
            >
                <IconButton className={closeButtonClassNames} onClick={props.handleClose}>
                    <CloseIcon />
                </IconButton>
                <Carousel infiniteLoop showThumbs={false} selectedItem={props.selectedItem || 0}>
                    {
                        props.data.areaImages.map((image, i) => {
                            return (
                                <div key={i} className={classes.imageContainer}>
                                    <img
                                        className={classes.image}
                                        src={image.imageUrl}
                                        alt='thumbnail'
                                    />
                                </div>
                            )
                        })
                    }
                </Carousel>
            </Dialog>
        </div>
    );
};

const mapStateToProps = (state) => ({
    data: state.data,
});

export default connect(mapStateToProps)(ImagesGallery);