import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button }        from "@dashboardComponents/Tools/Button";
import { CategoryForm }   from "./CategoryForm";

export class CategoryUpdate extends Component {
    render () {
        const { onChangeContext, onUpdateList, element } = this.props;

        return <>
            <div>
                <div className="toolbar">
                    <div className="item">
                        <Button icon="left-arrow" type="default" onClick={() => onChangeContext("list")}>Retour à la liste</Button>
                    </div>
                </div>
                <div className="form">
                    <h2>Modifier {element.name}</h2>
                    <CategoryForm
                        context="update"
                        url={Routing.generate('api_blog_categories_update', {'id': element.id})}
                        name={element.name}
                        onUpdateList={onUpdateList}
                        onChangeContext={onChangeContext}
                        messageSuccess="Félicitation ! La mise à jour s'est réalisé avec succès !"
                    />
                </div>
            </div>
        </>
    }
}