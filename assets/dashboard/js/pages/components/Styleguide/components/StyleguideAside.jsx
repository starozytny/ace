import React, { Component } from "react";

import { Button } from "@dashboardComponents/Tools/Button";
import { Aside } from "@dashboardComponents/Tools/Aside";

export class StyleguideAside extends Component {
    constructor(props) {
        super();

        this.aside = React.createRef();

        this.handleOpen = this.handleOpen.bind(this);
    }

    handleOpen = () => {
        this.aside.current.handleOpen();
    }

    render () {

        let content = <div>Hello world</div>

        return (
            <section>
                <h2>Aside</h2>
                <div className="aside-items">
                    <Button type="default" onClick={this.handleOpen}>Test Aside</Button>
                </div>

                <Aside ref={this.aside} content={content}>Test titre aside</Aside>
            </section>
        )
    }
}