import React, { Component } from "react";

import { Button } from "@dashboardComponents/Tools/Button";

export class FormLayout extends Component{
    render() {
        const { onChangeContext, children, form } = this.props;

        return <div>
            <div className="toolbar">
                <div className="item">
                    <Button outline={true} icon="left-arrow" type="primary" onClick={() => onChangeContext("list")}>Retour à la liste</Button>
                </div>
            </div>

            <div className="form">
                <h2>{children}</h2>
                {form}
            </div>
        </div>
    }
}