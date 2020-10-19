import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';import { makeStyles } from '@material-ui/core/styles';
import PanoramaIcon from '@material-ui/icons/Panorama';

const drawerWidth = 400;    // TODO something not fixed?
const useStyles = makeStyles((theme) => ({
    drawer: {
        width: '40%',
        maxWidth: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        marginTop: '64px',  // App bar height
        width: '40%',
        maxWidth: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '27%',
        backgroundColor: '#E5E5E5'
    },
    placeholderImage: {
        fontSize: '8rem',
        color: theme.palette.grey[400]
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
        alignItems: 'flex-start'
    },
    horizontalDrawerSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    sectionTitle: {
        fontSize: '1.1em',
        fontWeight: 500,
        marginBottom: theme.spacing(1)
    },
    viewMoreButton: {
        alignSelf: 'center',
        marginTop: theme.spacing(2)
    },
    gridContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        width: '100%',
        padding: theme.spacing(1, 0)
    },
    gridList: {
        width: '100%',
        padding: 0
    },
    avatar: {
        width: '100%',
        height: '100%'
    },
    avatarIcon: {
        fontSize: '2.5em'
    }
}));

const mockImageData = [
    {
        key: '1'
    },
    {
        key: '2'
    },
    {
        key: '3'
    },
    {
        key: '4'
    },
    {
        key: '5'
    },
    {
        key: '6'
    }
];

const SidePanel = (props) => {
    const classes = useStyles();
    const images = props.images ? props.images : [];
    //const theme = useTheme();
    return (
        <Drawer
            className={classes.drawer}
            variant='persistent'
            anchor='left'
            open={props.open}
            classes={{
                paper: classes.drawerPaper
            }}
        >
            <Box className={classes.drawerHeader}>
                {
                    images.length > 0 ? (
                        <div>TODO insert image</div>
                    ) : (
                        <PanoramaIcon className={classes.placeholderImage}/>
                    )
                }
                <IconButton
                    className={classes.closeButton}
                    onClick={props.handleClose}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider/>
            <Box className={classes.drawerSection}>
                <Typography className={classes.sectionTitle}>{props.locationName}</Typography>
                <Typography>{props.locationInfo}</Typography>
            </Box>
            <Divider/>
            <Box
                className={[classes.drawerSection, classes.horizontalDrawerSection]}
            >
                <Button
                    className={classes.drawerButton}
                    variant='contained'
                    disableElevation
                    color='primary'
                >
                    Add image
                </Button>
                <Button
                    className={classes.drawerButton}
                    variant='contained'
                    disableElevation
                    color='primary'
                >
                    Request images
                </Button>
            </Box>
            <Divider/>
            <Box className={classes.drawerSection}>
                <Typography  className={classes.sectionTitle}>Images</Typography>
                <Box className={classes.gridContainer}>
                    <GridList
                        cellHeight={120}
                        className={classes.gridList}
                        cols={3}
                    >
                        { /* TODO use mock data for now */
                            mockImageData.map((image) => (
                                <GridListTile key={image.key}>
                                    <Avatar className={classes.avatar} variant='square'>
                                        <PanoramaIcon className={classes.avatarIcon}/>
                                    </Avatar>
                                </GridListTile>
                            ))
                        }
                    </GridList>
                </Box>
                <Button
                    className={classes.viewMoreButton}
                    color='primary'
                >
                    View more...
                </Button>
            </Box>
        </Drawer>
    )
};

export { SidePanel }