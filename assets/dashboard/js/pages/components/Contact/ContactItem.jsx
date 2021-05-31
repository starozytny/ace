import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class ContactItem extends Component {
    render () {
        const { elem, onChangeContext, onDelete, onSelectors } = this.props

        return <div className="item">
            <Selector id={elem.id} onSelectors={onSelectors} />

            <div className="item-content">
                <div className="item-body">
                    <div className="infos">
                        <div onClick={() => onChangeContext('read', elem)}>
                            <div className="name">
                                <span>{elem.name}</span>
                            </div>
                            <div className="sub">{elem.email}</div>
                            <div className="sub">{elem.createdAtAgo}</div>

                            <div className="sub sub-seen">
                                <span className={elem.isSeen ? "icon-check" : "icon-vision-not"} />
                                <span>{elem.isSeen ? "Lu" : "Non lu"}</span>
                            </div>
                        </div>
                        <div className="actions">
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}