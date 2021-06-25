import React, { Component } from 'react';

import { Alert }        from "@dashboardComponents/Tools/Alert";

import { ArticlesItem } from "./ArticlesItem";

export class ArticlesList extends Component {

    render () {
        const { data, categories, filter, onFilter } = this.props;

        return <>
            <div>
                <div className="toolbar">
                    <div className="item create">
                        <div className="filter-categories">
                            <div onClick={() => onFilter(9999)} className={filter === 9999 ? " active" : ""}>Toutes les catégories</div>
                            {categories.map(el => {
                                return <div onClick={() => onFilter(el.id)} className={el.id === filter ? " active" : ""} key={el.id}>{el.name}</div>
                            })}
                        </div>
                    </div>
                </div>

                <div className="items-table">
                    <div className="items items-default items-user">
                        {data && data.length !== 0 ? data.map(elem => {
                            return <ArticlesItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat pour le moment</Alert>}
                    </div>
                </div>

            </div>
        </>
    }
}