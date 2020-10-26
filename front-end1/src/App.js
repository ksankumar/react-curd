import React from 'react';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import './App.css';

const theme = createMuiTheme({
    background: green,
    palette: {
        primary: { main: '#282c34' },
        secondary: green,
        white:{main: '#ffffff'}
    },
    status: {
        danger: 'orange',
    },
});

function App () {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Header/>
                <section className="App-container">
                    <Dashboard/>
                </section>
            </div>
        </ThemeProvider>
    );
}

export default App;
