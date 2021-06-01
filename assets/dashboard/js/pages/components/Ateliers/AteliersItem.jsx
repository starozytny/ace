import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class AteliersItem extends Component {
    render () {
        const { elem, onChangeContext, onDelete, onSelectors } = this.props

        return <div className="item">
            <Selector id={elem.id} onSelectors={onSelectors} />

            <div className="item-content">
                <div className="item-body">
                    <div className="avatar">
                        <img src={location.origin + `/ateliers/${elem.file}`} alt={`Illustration de ${elem.name}`}/>
                    </div>
                    <div className="infos">
                        <div>
                            <div className="name">
                                <span>{elem.name}</span>
                            </div>
                            <div className="sub">De {elem.min} à {elem.max} personnes</div>
                        </div>
                        <div className="actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}