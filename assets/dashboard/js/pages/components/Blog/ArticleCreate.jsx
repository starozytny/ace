import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button }        from "@dashboardComponents/Tools/Button";
import { ArticleForm }   from "./ArticleForm";

export class ArticleCreate extends Component {
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
                    <h2>Ajouter un article</h2>
                    <ArticleForm
                        context="create"
                        url={Routing.generate('api_articles_create')}
                        title=""
                        introduction=""
                        content=""
                        onUpdateList={onUpdateList}
                        onChangeContext={onChangeContext}
                        messageSuccess="Félicitation ! Vous avez ajouté un nouveau article !"
                    />
                </div>
            </div>
        </>
    }
}