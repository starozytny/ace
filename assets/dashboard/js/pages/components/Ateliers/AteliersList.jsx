import React, { Component } from 'react';

import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";

import { Search }       from "@dashboardComponents/Layout/Search";
import { Alert }        from "@dashboardComponents/Tools/Alert";

import { AteliersItem } from "./AteliersItem";

export class AteliersList extends Component {

    render () {
        const { data, onChangeContext, onDeleteAll } = this.props;

        return <>
            <div>
                <div className="toolbar">
                    <div className="item create">
                        <Button onClick={() => onChangeContext("create")}>Ajouter un atelier</Button>
                    </div>
                </div>

                <div className="items-table">
                    <div className="items items-default items-user">
                        {data && data.length !== 0 ? data.map(elem => {
                            return <AteliersItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>

                <div className="page-actions">
                    <div className="selectors-actions">
                        <div className="item" onClick={onDeleteAll}>
                            <ButtonIcon icon="trash" text="Supprimer la sélection" />
                        </div>
                    </div>
                </div>

            </div>
        </>
    }
}