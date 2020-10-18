import React from 'react';
import Box from '@material-ui/core/Box';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    buttonsContainer: {
        width: '100%',
        display: 'flex',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: theme.spacing(3)
    },
    invisible: {
        visibility: 'none'
    },
    mapButtons: {
        display: 'flex',
        flexDirection: 'column',
    },
    fab: {
        backgroundColor: 'white',
    },
    box: {
        marginTop: theme.spacing(3),
    },
    buttonGroup: {
        width: '100%'
    },
    button: {
        backgroundColor: 'white',
        padding: theme.spacing(1),
        border: 'none',
        '&:last-child': {
            borderTop: '1px solid #E5E5E5'
        }
    }
}));

const MapUtilityButtons = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.buttonsContainer}>
            {/* This button is used to position the other two buttons correctly */}
            <Button className={classes.invisible}/>
            <Fab
                size='medium'
                variant='extended'
                color='primary'
            >
                Add image to my location
            </Fab>
            <div className={classes.mapButtons}>
                <Fab className={classes.fab} size='medium'>
                    <GpsFixedIcon/>
                </Fab>
                <Box className={classes.box} boxShadow={4} borderRadius={5}>
                    <ButtonGroup
                        className={classes.buttonGroup}
                        orientation='vertical'
                    >
                        <Button className={classes.button} size="small"><AddIcon/></Button>
                        <Button className={classes.button} size="small"><RemoveIcon/></Button>
                    </ButtonGroup>
                </Box>
            </div>
        </div>
    )
};

export { MapUtilityButtons }