import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle';
import freedomLogo from '../assets/images/ffn_logo.svg'
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const style = {
    header: {
        background: '#ffffff'
    },
    logo: {
        height: '3rem',
        padding: '0 .5rem',
    },
    black: {
        color: '#000000'
    }
};
export default function Header () {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppBar position="fixed" style={style.header}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} style={style.black} aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    <a href='/'>
                        <img style={style.logo} src={freedomLogo} alt="App logo"/>
                    </a>
                    <Typography variant="h6" className={classes.title} style={{ color: '#25428F' }}>
                        <Box textAlign="center" fontWeight="fontWeightBold">
                            Freedom Financial Network - Code Assessment
                        </Box>
                    </Typography>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        style={style.black}>
                        <AccountCircle/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    )
}
