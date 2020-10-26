/* eslint no-undef: 0 */
import React, { Component } from 'react';
import UserForm from '../components/UserForm'

export default class DashBoard extends Component {

    render() {
        return (
            <section className="app-container">
                <div className="row middle-xs">
                    <div className="col-xs-12 col-sm-8 col-md-6 col-lg-6">
                       <UserForm></UserForm>
                    </div>

                    <div className="col-xs-12 col-sm-8 col-md-6 col-lg-6">
                        <div className="box">12</div>
                    </div>
                </div>
            </section>
        );
    }
}
