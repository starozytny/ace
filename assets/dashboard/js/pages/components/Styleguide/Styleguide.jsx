import React, { Component } from "react";

import { StyleguideForm }      from "./components/StyleguideForm";
import { StyleguideMaps }      from "./components/StyleguideMaps";
import { StyleguideHelp }      from "./components/StyleguideHelp";
import { StyleguideLozad }     from "./components/StyleguideLozad";
import { StyleguideTable }     from "./components/StyleguideTable";
import { StyleguideAside }     from "./components/StyleguideAside";
import { StyleguideAlert }     from "./components/StyleguideAlert";
import { StyleguideButton }    from "./components/StyleguideButton";
import { StyleguidePlanning }  from "./components/StyleguidePlanning";
import { StyleguideAccordion } from "./components/StyleguideAccordion";

export class Styleguide extends Component {
    render () {
        return <div className="main-content">
            <StyleguideForm />
            <StyleguideHelp />
            <StyleguideAlert />
            <StyleguideButton />
            <StyleguideAccordion />
            <StyleguidePlanning />
            <StyleguideTable />
            {/*<StyleguideMaps />*/}
            <StyleguideAside />
            {/*<StyleguideLozad />*/}
        </div>
    }
}