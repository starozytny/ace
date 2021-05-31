import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Page }          from "@dashboardComponents/Layout/Page";
import { LoaderElement } from "@dashboardComponents/Layout/Loader";
import Sort              from "@dashboardComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { ArticlesList }  from "./ArticlesList";
import axios from "axios";

export class Articles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "list",
            loadPageError: false,
            loadData: true,
            data: null,
            currentData: null,
            element: null,
            perPage: 10,
            filter: 9999
        }

        this.page = React.createRef();

        this.handleUpdateData = this.handleUpdateData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }

    componentDidMount() {
        const { perPage, filter } = this.state;

        const self = this;
        axios.get(Routing.generate('api_articles_index'), {})
            .then(function (response) {
                let resp = response.data;

                let data = JSON.parse(resp.articles);
                let categories = JSON.parse(resp.categories);

                data.sort(Sort.compareCreatedAt);
                self.setState({ categories: categories, dataImmuable: data, data: data, currentData: data.slice(0, perPage) });
            })
            .catch(function () {
                self.setState({ loadPageError: true });
            })
            .then(function () {
                self.setState({ loadData: false });
            })
        ;
    }

    handleUpdateData = (data) => { this.setState({ currentData: data })  }

    handleUpdateList = (element, newContext=null) => {
        const { data, context, perPage } = this.state
        Formulaire.updateDataPagination(this, Sort.compareLastname, newContext, context, data, element, perPage);
    }

    handleFilter = (id) => {
        const { dataImmuable, perPage } = this.state;

        let data = [];
        if(id === 9999){
            data = dataImmuable
        }else{
            dataImmuable.forEach(el => {
                if(el.category.id === id){
                    data.push(el);
                }
            })
        }

        this.setState({ filter: id, data: data, currentData: data.slice(0, perPage) });
    }

    render () {
        const { loadPageError, context, loadData, data, currentData, categories, filter } = this.state;

        let content, havePagination = false;
        switch (context){
            default:
                havePagination = true;
                content = loadData ? <LoaderElement /> : <ArticlesList categories={categories} filter={filter} onFilter={this.handleFilter} data={currentData} />
                break;
        }

        if(data && data.length <= 0){
            havePagination = false;
        }

        return <>
            <Page ref={this.page} haveLoadPageError={loadPageError}
                  havePagination={havePagination} taille={data && data.length} data={data} onUpdate={this.handleUpdateData}
            >
                {content}
            </Page>
        </>
    }
}