import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Page }          from "@dashboardComponents/Layout/Page";
import { LoaderElement } from "@dashboardComponents/Layout/Loader";
import Sort              from "@dashboardComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { ArticlesList }  from "./ArticlesList";
import { ArticleCreate } from "./ArticleCreate";
import { ArticleUpdate } from "./ArticleUpdate";
import axios from "axios";
import toastr from "toastr";

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
            perPage: 10
        }

        this.page = React.createRef();

        this.handleUpdateData = this.handleUpdateData.bind(this);
        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
        this.handleChangePublished = this.handleChangePublished.bind(this);
    }

    componentDidMount() { Formulaire.axiosGetDataPagination(this, Routing.generate('api_articles_index'), this.state.perPage) }

    handleUpdateData = (data) => { this.setState({ currentData: data })  }

    handleUpdateList = (element, newContext=null) => {
        const { data, context, perPage } = this.state
        Formulaire.updateDataPagination(this, Sort.compareLastname, newContext, context, data, element, perPage);
    }

    handleChangeContext = (context, element=null) => {
        this.setState({ context, element });
        if(context === "list"){
            this.page.current.pagination.current.handleComeback()
        }
    }

    handleDelete = (element) => {
        Formulaire.axiosDeleteElement(this, element, Routing.generate('api_articles_delete', {'id': element.id}),
            'Supprimer cet article ?', 'Cette action est irréversible.');
    }
    handleDeleteGroup = () => {
        let checked = document.querySelectorAll('.i-selector:checked');
        Formulaire.axiosDeleteGroupElement(this, checked, Routing.generate('api_articles_delete_group'), 'Aucun article sélectionné.')
    }

    handleSearch = (search) => {
        const { dataImmuable, perPage } = this.state;

        if(search === "") {
            this.setState({ data: dataImmuable, currentData: dataImmuable.slice(0, perPage) });
        }else{
            let newData = [];
            newData = dataImmuable.filter(function(v) {
                if(v.title.toLowerCase().includes(search)){
                    return v;
                }
            })
            this.setState({ data: newData, currentData: newData.slice(0, perPage) });
        }
    }

    handleChangePublished = (element) => {
        Formulaire.loader(true);
        let self = this;
        axios({ method: "POST", url: Routing.generate('api_articles_article_published', {'id': element.id}) })
            .then(function (response) {
                let data = response.data;
                self.handleUpdateList(data, "update");
                toastr.info(element.isPublished ? "Article mis hors ligne" : "Article en ligne");
            })
            .catch(function (error) {
                Formulaire.displayErrors(self, error);
            })
            .then(() => {
                Formulaire.loader(false);
            })
        ;
    }

    render () {
        const { loadPageError, context, loadData, data, currentData, element } = this.state;

        let content, havePagination = false;
        switch (context){
            case "create":
                content = <ArticleCreate onChangeContext={this.handleChangeContext} onUpdateList={this.handleUpdateList} />
                break;
            case "update":
                content = <ArticleUpdate onChangeContext={this.handleChangeContext} onUpdateList={this.handleUpdateList} element={element}/>
                break;
            default:
                havePagination = true;
                content = loadData ? <LoaderElement /> : <ArticlesList onChangeContext={this.handleChangeContext}
                                                                   onDelete={this.handleDelete}
                                                                   onSearch={this.handleSearch}
                                                                   onDeleteAll={this.handleDeleteGroup}
                                                                   onChangePublished={this.handleChangePublished}
                                                                   data={currentData} />
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