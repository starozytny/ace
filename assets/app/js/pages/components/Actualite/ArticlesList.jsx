import React, { Component } from 'react';

import { Alert }        from "@dashboardComponents/Tools/Alert";

import { ArticlesItem } from "./ArticlesItem";

export class ArticlesList extends Component {

    render () {
        const { data } = this.props;

        return <>
            <div>
                <div className="toolbar">
                    <div className="item create">
                        <div>// TODO : filter with cat (nb cat ?)</div>
                    </div>
                </div>

                <div className="items-table">
                    <div className="items items-default items-user">
                        {data && data.length !== 0 ? data.map(elem => {
                            return <ArticlesItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>

            </div>
        </>
    }
}