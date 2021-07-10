import React, { Component } from "react";

export class Days extends Component {
    render () {
        const { data, dayActive, onSelectDay, useShortName = false } = this.props

        let days = [
            { id: 1, name: 'Lundi',    shortName: 'Lun' },
            { id: 2, name: 'Mardi',    shortName: 'Mar' },
            { id: 3, name: 'Mercredi', shortName: 'Mer' },
            { id: 4, name: 'Jeudi',    shortName: 'Jeu' },
            { id: 5, name: 'Vendredi', shortName: 'Ven' },
            { id: 6, name: 'Samedi',   shortName: 'Sam' },
        ];

        let items = days.map(elem => {

            let atLeastOne = false;
            if(data){
                data.forEach(el => {
                    if(el.day === elem.id || (el.slot && el.slot.day === elem.id)){
                        atLeastOne = true;
                    }
                })
            }

            return <div className={"day" + (elem.id === dayActive ? " active" : "") + (atLeastOne ? "" : " disabled")}
                        onClick={() => onSelectDay(elem.id, atLeastOne)}
                        key={elem.id}>
                {useShortName ? elem.shortName : elem.name}
            </div>
        })

        return <>
            <div className="days">
                {items}
            </div>
        </>
    }
}