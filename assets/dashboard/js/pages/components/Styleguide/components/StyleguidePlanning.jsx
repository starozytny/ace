import React, { Component } from "react";

import {Days} from "@dashboardComponents/Tools/Days";

export class StyleguidePlanning extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            dayActive: 1
        }

        this.handleSelectDay = this.handleSelectDay.bind(this);
    }

    handleSelectDay = (dayActive, atLeastOne) => { if(atLeastOne) { this.setState({ dayActive }) } }

    render () {
        const { data, dayActive } = this.state;

        return <section>
            <h2>Planning</h2>
            <div className="plannings-items">

                <Days data={data} dayActive={dayActive} onSelectDay={this.handleSelectDay}/>

            </div>
        </section>
    }

}