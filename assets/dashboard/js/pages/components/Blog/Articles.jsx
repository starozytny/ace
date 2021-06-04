import React, { Component } from 'react';

import axios             from "axios";
import toastr            from "toastr";
import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import {Layout }         from "@dashboardComponents/Layout/Page";
import Sort              from "@dashboardComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { ArticlesList }      from "./ArticlesList";
import { ArticleFormulaire } from "./ArticleForm";

function searchFunction(dataImmuable, search){
    let newData = [];
    newData = dataImmuable.filter(function(v) {
        if(v.title.toLowerCase().includes(search)){
            return v;
        }
    })

    return newData;
}

export class Articles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChangePublished = this.handleChangePublished.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
    }

    handleGetData = (self) => {
        const { perPage } = this.state;

        axios.get(Routing.generate('api_articles_index'), {})
            .then(function (response) {
                let resp = response.data;

                let data = JSON.parse(resp.articles);
                let categories = JSON.parse(resp.categories);

                data.sort(Sort.compareCreatedAt);
                self.setState({ categories: categories, dataImmuable: data, data: data, currentData: data.slice(0, perPage) });
            })
            .catch(function (error) {
                console.log(error)
                console.log(error.response)
                self.setState({ loadPageError: true });
            })
            .then(function () {
                self.setState({ loadData: false });
            })
        ;
    }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext, Sort.compareCreatedAt); }

    handleDelete = (element) => {
        Formulaire.axiosDeleteElement(this, element, Routing.generate('api_articles_delete', {'id': element.id}),
            'Supprimer cet article ?', 'Cette action est irréversible.');
    }
    handleDeleteGroup = () => {
        let checked = document.querySelectorAll('.i-selector:checked');
        Formulaire.axiosDeleteGroupElement(this, checked, Routing.generate('api_articles_delete_group'), 'Aucun article sélectionné.')
    }

    handleSearch = (search) => { this.layout.current.handleSearch(search, searchFunction) }

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

    handleContentList = (currentData, changeContext) => {
        return <ArticlesList onChangeContext={changeContext}
                             onDelete={this.handleDelete}
                             onSearch={this.handleSearch}
                             onDeleteAll={this.handleDeleteGroup}
                             onChangePublished={this.handleChangePublished}
                             data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        return <ArticleFormulaire type="create" categories={this.layout.current.state.categories} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <ArticleFormulaire type="update" categories={this.layout.current.state.categories} element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}