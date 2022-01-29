import React, { Component } from "react";

import parse from "html-react-parser";

export class Accordion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            multiple: props.multiple ? props.multiple : false,
            active: [],
        }

        this.handleOpen = this.handleOpen.bind(this);
    }

    handleOpen = (id) => {
        const { active, multiple } = this.state;

        let value;
        let find = false;
        active.forEach(act => {
            if(act === id){
                find = true;
            }
        })

        if(find){
            value = active.filter(act => { return act !== id });
        }else{
            if(multiple){
                active.push(id);
                value = active;
            }else{
                value = [id];
            }
        }

        this.setState({ active: value });
    }

    render () {
        const { data } = this.props;
        const { active, multiple } = this.state;

        return <div className={"accordion" + (multiple ? " accordion-multiple" : "")}>
            {data.map(el => {

                let activeClassName = "";
                let iconClassName = "plus";
                active.forEach(act => {
                    if(act === el.id){
                        activeClassName = " active"
                        iconClassName = "minus"
                    }
                })

                return <div className={"accordion-item" + (activeClassName)} key={el.id}>
                    <div className="accordion-item-title" onClick={() => this.handleOpen(el.id)}>
                        <span className="title">{el.title}</span>
                        <span className={"icon-" + (iconClassName)} />
                    </div>
                    <div className="accordion-item-content">
                        {parse(el.content)}
                    </div>
                </div>
            })}
        </div>
    }
}