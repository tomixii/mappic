import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import { MapUtilityButtons } from './map-utility-buttons';
import { Map } from './map';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: 0,
        height: '100%',
        display: 'flex',
        justifyContent: 'center'
    }
}));

const Main = () => {
    const classes = useStyles();
    return (
        <Container className={classes.container}>
            <Map/>
            <MapUtilityButtons/>
        </Container>
    )
};

export { Main }