import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button }        from "@dashboardComponents/Tools/Button";
import { AtelierForm }   from "./AtelierForm";

export class AtelierUpdate extends Component {
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
                    <AtelierForm
                        context="update"
                        url={Routing.generate('api_ateliers_update', {'id': element.id})}
                        name={element.name}
                        content={element.content}
                        min={element.min}
                        max={element.max}
                        file={element.file}
                        onUpdateList={onUpdateList}
                        onChangeContext={onChangeContext}
                        messageSuccess="Félicitation ! La mise à jour s'est réalisé avec succès !"
                    />
                </div>
            </div>
        </>
    }
}