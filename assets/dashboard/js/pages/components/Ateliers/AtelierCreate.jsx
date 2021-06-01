import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button }        from "@dashboardComponents/Tools/Button";
import { AtelierForm }   from "./AtelierForm";

export class AtelierCreate extends Component {
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
                    <h2>Ajouter un atelier</h2>
                    <AtelierForm
                        context="create"
                        url={Routing.generate('api_ateliers_create')}
                        name=""
                        content=""
                        min=""
                        max=""
                        file=""
                        onUpdateList={onUpdateList}
                        onChangeContext={onChangeContext}
                        messageSuccess="Félicitation ! Vous avez ajouté un nouveau atelier !"
                    />
                </div>
            </div>
        </>
    }
}