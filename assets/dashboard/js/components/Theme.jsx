import React, { Component } from "react";

import { Checkbox } from "@dashboardComponents/Tools/Fields";

function setTheme(value) {
    let body = document.getElementById("theme-body");
    if(value === 1){
        body.classList.remove('dark-mode');
    }else{
        body.classList.add('dark-mode');
    }
}

export class Theme extends Component{
    constructor(props) {
        super();

        this.state = {
            theme: [1],
            sessionName: "theme.localwebsite"
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        let save = localStorage.getItem('theme.localwebsite');

        if(save){
            setTheme(parseInt(save));
            this.setState({ theme: [parseInt(save)] })
        }else{
            setTheme(this.state.theme[0]);
        }
    }

    handleChange = (e) => {
        let name = e.currentTarget.name;
        let value = e.currentTarget.value;
        let val = (e.currentTarget.checked) ? parseInt(value) : 1;

        if(name === "theme"){
            value = [val] // parseInt because work with int this time
        }

        this.setState({ [name]: value })
        setTheme(val);

        localStorage.setItem('theme.localwebsite', val)
    }

    render() {
        const { theme } = this.state;

        let switcherItems = [ { value: 0, label: 'Dark', identifiant: 'theme-dark' } ]

        return <div className="theme-container" title="Thème">
            <Checkbox isSwitcher={true} items={switcherItems} identifiant="theme" valeur={theme} errors={[]} onChange={this.handleChange} />
            <span className="tooltip">Thème</span>
        </div>
    }
}