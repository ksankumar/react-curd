import React, { Component } from 'react';
import HeaderAnimation from './headerAnim'
import './header.css';

export default class Header extends Component {
  componentDidMount() {
    const hd = new HeaderAnimation('header').init();
    console.log(hd);
  }
  render() {
    return (
      <header className="page__header" id="header">
        <canvas id="c"></canvas>
        <h1>Fancy Header</h1>
      </header>
    );
  }
}
