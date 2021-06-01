import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button }        from "@dashboardComponents/Tools/Button";
import { ServiceForm }   from "./ServiceForm";

export class ServiceUpdate extends Component {
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
                    <h2>Modifier {element.title}</h2>
                    <ServiceForm
                        context="update"
                        url={Routing.generate('api_services_update', {'id': element.id})}
                        title={element.title}
                        intro={element.intro}
                        content={element.content}
                        onUpdateList={onUpdateList}
                        onChangeContext={onChangeContext}
                        messageSuccess="Félicitation ! La mise à jour s'est réalisé avec succès !"
                    />
                </div>
            </div>
        </>
    }
}