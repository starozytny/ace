import React, { Component } from 'react';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";

import { Alert }      from "@dashboardComponents/Tools/Alert";

import { TestimonialsItem }   from "./TestimonialsItem";

export class TestimonialsList extends Component {
    render () {
        const { data, onChangeContext,onDeleteAll } = this.props;

        return <>
            <div>
                <div className="toolbar">
                    <div className="item create">
                        <Button onClick={() => onChangeContext("create")}>Ajouter un témoignage</Button>
                    </div>
                </div>

                <div className="items-table">
                    <div className="items items-default items-user">
                        {data && data.length !== 0 ? data.map(elem => {
                            return <TestimonialsItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
            </div>
        </>
    }
}