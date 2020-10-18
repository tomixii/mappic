import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        textAlign: 'start'
    }
}));

const Header = () => {
    const classes = useStyles();

    return (
        <AppBar position='static'>
            <Toolbar>
                <Typography variant='h6' className={classes.title}>
                    Mappic
                </Typography>
                <Button color='inherit'>Login</Button>
            </Toolbar>
        </AppBar>
    )
};

export { Header }