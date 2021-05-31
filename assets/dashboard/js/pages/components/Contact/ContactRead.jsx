import React, { Component } from 'react';

import { Button }        from "@dashboardComponents/Tools/Button";

export class ContactRead extends Component {
    render () {
        const { element, onChangeContext } = this.props;

        return <>
            <div>
                <div className="toolbar">
                    <div className="item">
                        <Button outline={true} icon="left-arrow" type="primary" onClick={() => onChangeContext("list")}>Retour à la liste</Button>
                    </div>
                </div>

                <div className="item-contact-read">
                    <div className="name">{element.name}</div>
                    <div className="sub">{element.email}</div>
                    <div className="sub sub-time">{element.createdAtAgo}</div>
                    <div className="sub-message">{element.message}</div>
                </div>
            </div>
        </>
    }
}