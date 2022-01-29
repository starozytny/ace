import React, { Component } from 'react';

import parse from "html-react-parser";

export class Menu extends Component {
    constructor(props) {
        super();

        this.state = {
            isOpened: false
        }

        this.handleOpenMenu = this.handleOpenMenu.bind();
    }

    componentDidMount () {
        const { menu } = this.props

        let tab = location.pathname.split("/");
        tab = tab.filter(elem => elem !== "");

        let find = false;
        tab.forEach(element => {
            JSON.parse(menu).forEach(el => {
                if(el.dropdown && el.dropdown === true){
                    el.items.forEach(elem => {
                        if(element === elem.name){
                            find = true;
                            this.setState({active: element})
                        }
                    })
                }else{
                    if(element === el.name){
                        find = true;
                        this.setState({active: element})
                    }
                }
            })
        });

        if(!find){
            this.setState({active: 'accueil'})
        }
    }

    handleOpenMenu = () => {
        this.setState(prevState => {
            return { isOpened: !prevState.isOpened }
        })
    }

    render () {
        const { menu, menuBottom } = this.props
        const { isOpened, active } = this.state

        return <>
            <div className="nav-mobile" onClick={this.handleOpenMenu}>
                <span className={`icon-${ isOpened ? "cancel" : "menu" }`} />
            </div>
            <div className={`nav-body ${isOpened}`}>
                <div className="items">
                    { <MenuItem menu={menu} active={active} /> }
                </div>
                {menuBottom &&  <div className="items">
                    { <MenuItem menu={menuBottom} active={active}/> }
                </div>}
            </div>
        </>
    }
}

function MenuItem (props){
    const { menu, active } = props

    return (
        JSON.parse(menu).map((el, index) => {
            if(el.dropdown && el.dropdown === true){

                let items = el.items.map((elem, index) => {
                    return <Item key={index} active={active} el={elem} />
                })

                return <div key={index} className="item item-dropdown">
                    <span>{el.label} <span className="icon-right-chevron" /></span>
                    <div className="item-dropdown-items">
                        <div className="item-dropdown-items-container">
                            {items}
                        </div>
                    </div>
                </div>
            }else{
                return <Item key={index} active={active} el={el} />
            }


        })
    )
}

function Item({ el, active }){
    return (
        <div className="item">
            <a href={el.path} target={el.target ? "_blank" : ""} className={ active === el.name ? "active" : "" }>
                {el.icon && <span className={`icon-${el.icon}`} />}
                <span>{parse(el.label)}</span>
            </a>
        </div>
    )
}