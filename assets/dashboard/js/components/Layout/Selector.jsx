import React, { Component } from 'react';

export class Selector extends Component {
    constructor() {
        super();

        this.state = {
            isChecked: false
        }

        this.handleChange = this.handleChange.bind(this);
    }

    // from fo uncheck via toolbar filter checked
    handleChange = (e) => {
        let isChecked = !!(e.currentTarget.checked)

        this.setState({ isChecked })
    }

    render () {
        const { id } = this.props;
        const { isChecked } = this.state;

        return <div className="selector">
            <input type="checkbox" name="item-selector" className="i-selector" id={`item-selector-${id}`} value={id} checked={isChecked} onChange={this.handleChange}/>
            <label htmlFor={`item-selector-${id}`} className={`item-selector ${isChecked}`}/>
        </div>
    }
}