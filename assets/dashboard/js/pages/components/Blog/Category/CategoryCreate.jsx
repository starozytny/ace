import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button }        from "@dashboardComponents/Tools/Button";
import { CategoryForm }   from "./CategoryForm";

export class CategoryCreate extends Component {
    render () {
        const { onChangeContext, onUpdateList } = this.props;

        return <>
            <div>
                <div className="toolbar">
                    <div className="item">
                        <Button outline={true} icon="left-arrow" type="primary" onClick={() => onChangeContext("list")}>Retour à la liste</Button>
                    </div>
                </div>

                <div className="form">
                    <h2>Ajouter une catégorie</h2>
                    <CategoryForm
                        context="create"
                        url={Routing.generate('api_blog_categories_create')}
                        name=""
                        onUpdateList={onUpdateList}
                        onChangeContext={onChangeContext}
                        messageSuccess="Félicitation ! Vous avez ajouté une nouvelle catégorie !"
                    />
                </div>
            </div>
        </>
    }
}