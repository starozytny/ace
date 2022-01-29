import React, { Component } from 'react';

export class Search extends Component {
    constructor() {
        super();

        this.state = {
            search: ""
        }

        this.handleChange = this.handleChange.bind(this);
    }

    // from fo uncheck via toolbar filter checked
    handleChange = (e) => {
        let val = e.currentTarget.value;
        this.setState({search: val});

        this.props.onSearch(val);
    }

    render () {
        const { placeholder = "Recherche..." } = this.props;
        const { search } = this.state;

        return <div className={`search ${search !== "" ? " active" : ""}`}>
            <input type="search" name="search" id="search" value={search} placeholder={placeholder} onChange={this.handleChange} />
            <span className="icon-search" />
        </div>
    }
}