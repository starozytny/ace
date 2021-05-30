import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class ArticlesItem extends Component {
    render () {
        const { elem, onChangeContext, onDelete, onSelectors, onChangePublished } = this.props

        return <div className="item">
            <Selector id={elem.id} onSelectors={onSelectors} />

            <div className="item-content">
                <div className="item-body">
                    <div className="infos">
                        <div>
                            <div className="name">
                                <span>{elem.title}</span>
                            </div>
                            <div className="sub">Créé : {elem.createAtString} {elem.updatedAtAgo && "- Modifié : " + elem.updatedAtAgo}</div>
                            <div className="sub link">
                                {location.origin + "/articles/" + elem.slug}
                                <a href="" target="_blank"> <span className="icon-link-2" /> </a>
                            </div>
                        </div>
                        <div className="actions">
                            <ButtonIcon icon={elem.isPublished ? "vision" : "vision-not"} onClick={() => onChangePublished(elem)}>
                                {elem.isPublished ? "En ligne" : "Hors ligne"}
                            </ButtonIcon>
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}