import React, { Component } from "react";

import { StyleguideButton }   from "./components/StyleguideButton";
import { StyleguideAlert }    from "./components/StyleguideAlert";
import { StyleguideForm }     from "./components/StyleguideForm";
import { StyleguideAside }    from "./components/StyleguideAside";
import { StyleguideMaps }     from "./components/StyleguideMaps";
import { StyleguideTable }    from "./components/StyleguideTable";
import { StyleguidePlanning } from "./components/StyleguidePlanning";

export class Styleguide extends Component {
    render () {
        return <div className="main-content">
            <StyleguidePlanning />
            <StyleguideForm />
            <StyleguideTable />
            <StyleguideMaps />
            <StyleguideAside />
            <StyleguideButton />
            <StyleguideAlert />
        </div>
    }
}