import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class NotificationsItem extends Component {
    render () {
        const { elem, onDelete, onSelectors, onSeen } = this.props

        return <div className="item">
            <Selector id={elem.id} onSelectors={onSelectors} />

            <div className="item-content">
                <div className="item-body">
                    <div className="avatar">
                        <span className={"icon-" + elem.icon} />
                    </div>
                    <div className="infos">
                        <div onClick={() => onSeen(elem)}>
                            <a className="name" href={elem.url}>
                                {!elem.isSeen && <span className="toSee" />}
                                <span>{elem.name}</span>
                            </a>
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