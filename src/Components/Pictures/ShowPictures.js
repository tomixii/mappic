import React, {useEffect, useState} from 'react';
import 'react-html5-camera-photo/build/css/index.css';
import { withFirebase } from '../Firebase';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Avatar from "@material-ui/core/Avatar";
import PanoramaIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import CameraApp from "./Camera";

const useStyles = makeStyles((theme) => ({
    drawerSection: {
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    sectionTitle: {
        fontSize: '1.1em',
        fontWeight: 500,
        marginBottom: theme.spacing(1),
    },

    gridContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        width: '100%',
        padding: theme.spacing(1, 0),
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    avatarIcon: {
        fontSize: '2.5em',
    },
}));

function ShowPictures ({firebase}) {
    const classes = useStyles();

    const [pictures, setPictures] = useState([]);
    const [cameraOn, setCameraOn] = useState(false);

    useEffect(() => {
        firebase
            .pictures()
            .get()
            .then(function (snapshot) {
                snapshot.forEach((doc) => {
                    setPictures(oldArray => [...oldArray, doc.data()])

                })
            })
            .catch(function (error) {
                console.error('Error adding document: ', error);
            });

    }, []);



    return (
        <div>
            {cameraOn ?
                <CameraApp />
                :
                <Box className={classes.drawerSection}>
                    <Typography className={classes.sectionTitle}>Images</Typography>
                    <Box className={classes.gridContainer}>
                        <GridList cellHeight={120} className={classes.gridList} cols={3}>
                            <button onClick={() => setCameraOn(true)} style={{backgroundColor: 'black'}}>
                                <GridListTile>
                                    <Avatar className={classes.avatar} style={{backgroundColor: 'black'}}
                                            variant="square">
                                        <CameraAltIcon className={classes.avatarIcon} color={'white'}/>
                                    </Avatar>
                                </GridListTile>
                            </button>
                            {
                                pictures.map((image) => (
                                    <GridListTile>
                                        <Avatar className={classes.avatar} variant="square">
                                            <img src={image.imageUrl}/>
                                        </Avatar>
                                    </GridListTile>
                                ))
                            }
                        </GridList>
                    </Box>
                </Box>
            }
        </div>

    );
}


export default withFirebase(ShowPictures);