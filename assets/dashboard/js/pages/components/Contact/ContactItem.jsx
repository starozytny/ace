import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";
import Sanitize         from "@dashboardComponents/functions/sanitaze";

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
                                {!elem.isSeen && <span className="toSee" />}
                                <span>{elem.name}</span>
                            </div>
                            <div className="sub">{elem.email}</div>
                            {elem.phone && <div className="sub">{Sanitize.toFormatPhone(elem.phone)}</div>}
                            <div className="role">{elem.subject}</div>

                            <div className="sub">{elem.createdAtAgo}</div>
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