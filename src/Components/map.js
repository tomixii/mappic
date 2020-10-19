import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    mapContainer: {
        width: '100%',
        height: '100%'
    }
}));

const Map = () => {
    const classes = useStyles();
    return (
        <div className={classes.mapContainer}>
            {/* TODO insert map component */}
        </div>
    )
};

export { Map }