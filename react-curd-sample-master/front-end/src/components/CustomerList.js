import React, { Component } from 'react';
import HTTP from '../service';

export default class CustomerList extends Component {
    constructor() {
        super();
        this.state = {
            list: []
        };
        this.addItem = this.addItem.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        // this.updateMessage = this.updateMessage.bind(this);
    }

    addItem () {

    }

    async componentDidMount () {
        const books = await HTTP.get('list');
        console.log(books)
    }

    render () {
        return (
            <div className="customerlist">
                I m here
            </div>
        );
    }
}
