import React from 'react';
import AppBar from '@material-ui/core/AppBar';
/* TODO uncomment if authentication is implemented
import Button from '@material-ui/core/Button';
 */
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    title: {
        flexGrow: 1,
        textAlign: 'start'
    }
}));

const Header = () => {
    const classes = useStyles();

    return (
        <AppBar className={classes.appBar} position='static'>
            <Toolbar>
                <Typography variant='h6' className={classes.title}>
                    Mappic
                </Typography>
                {/* TODO uncomment if authentication is implemented
                <Button color='inherit'>Login</Button>
                */}
            </Toolbar>
        </AppBar>
    )
};

export { Header }
