import React from 'react';
import Header from './components/Header';
import Dashboard from './views/Dashboard';

import './App.css';
import './assets/css/flexgridbox.css';

function App() {
  return (
    <div className="App">
        <Header></Header>
        <Dashboard></Dashboard>
    </div>
  );
}

export default App;