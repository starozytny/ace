import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }         from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";

import { ArticlesList }      from "./ArticlesList";
import { ArticleFormulaire } from "./ArticleForm";

const URL_DELETE_ELEMENT    = 'api_articles_delete';
const URL_DELETE_GROUP      = 'api_articles_delete_group';
const MSG_DELETE_ELEMENT    = 'Supprimer cet article ?';
const MSG_DELETE_GROUP      = 'Aucun article sélectionné.';
const URL_SWITCH_ELEMENT    = 'api_articles_article_published';
const MSG_SWITCH_ELEMENT    = 'Article';
const SORTER = Sort.compareCreatedAt;

export class Articles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            pathDeleteGroup: URL_DELETE_GROUP,
            msgDeleteGroup: MSG_DELETE_GROUP,
            categories: props.categories ? JSON.parse(props.categories) : [],
            sessionName: "blog.articles.pagination"
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSwitchPublished = this.handleSwitchPublished.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "article"); }

    handleSwitchPublished = (element) => {
        this.layout.current.handleSwitchPublished(this, element, Routing.generate(URL_SWITCH_ELEMENT, {'id': element.id}), MSG_SWITCH_ELEMENT);
    }

    handleContentList = (currentData, changeContext) => {
        return <ArticlesList onChangeContext={changeContext}
                             onDelete={this.layout.current.handleDelete}
                             onDeleteAll={this.layout.current.handleDeleteGroup}
                             onSearch={this.handleSearch}
                             onChangePublished={this.handleSwitchPublished}
                             data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        return <ArticleFormulaire type="create" categories={this.state.categories} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <ArticleFormulaire type="update" categories={this.state.categories} element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}