import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button }        from "@dashboardComponents/Tools/Button";
import { ServiceForm }   from "./ServiceForm";

export class ServiceCreate extends Component {
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
                    <h2>Ajouter un service</h2>
                    <ServiceForm
                        context="create"
                        url={Routing.generate('api_services_create')}
                        title=""
                        intro=""
                        content=""
                        seance=""
                        nbSeance=""
                        onUpdateList={onUpdateList}
                        onChangeContext={onChangeContext}
                        messageSuccess="Félicitation ! Vous avez ajouté un nouveau service !"
                    />
                </div>
            </div>
        </>
    }
}