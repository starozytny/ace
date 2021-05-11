import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class ArticlesItem extends Component {
    render () {
        const { elem, onChangeContext, onDelete, onSelectors } = this.props

        return <div className="item">
            <Selector id={elem.id} onSelectors={onSelectors} />

            <div className="item-content">
                <div className="item-body">
                    <div className="infos">
                        <div>
                            <div className="name">
                                <span>{elem.title}</span>
                            </div>
                            <div className="sub sub-username">{elem.createAtString} {elem.updateAtAgo && ("- Modifié " + elem.updateAtAgo)}</div>
                        </div>
                        <div className="actions">
                            <ButtonIcon icon={"pencil"} onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon={"trash"} onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}