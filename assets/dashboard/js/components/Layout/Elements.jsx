import React, { Component } from "react";

import { Button } from "@dashboardComponents/Tools/Button";

export class FormLayout extends Component{
    render() {
        const { onChangeContext, children, form, url = null, text = "Retour à la liste" } = this.props;

        return <div>
            <div className="toolbar">
                <div className="item">
                    {onChangeContext ?
                        <Button outline={true} icon="left-arrow" type="primary" onClick={() => onChangeContext("list")}>{text}</Button>
                        :  <Button element="a" outline={true} icon="left-arrow" type="primary" onClick={url}>{text}</Button>
                    }

                </div>
            </div>

            <div className="form">
                <h2>{children}</h2>
                {form}
            </div>
        </div>
    }
}