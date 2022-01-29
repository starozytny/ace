import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }         from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { CategoriesList }     from "./CategoriesList";
import { CategoryFormulaire } from "./CategoryForm";

const URL_DELETE_ELEMENT    = 'api_blog_categories_delete';
const URL_DELETE_GROUP      = 'api_blog_categories_delete_group';
const MSG_DELETE_ELEMENT    = 'Supprimer cette catégorie ?';
const MSG_DELETE_GROUP      = 'Aucun catégorie sélectionnée.';
let SORTER = Sort.compareName;

function searchFunction(dataImmuable, search){
    let newData = [];
    newData = dataImmuable.filter(function(v) {
        if(v.name.toLowerCase().includes(search)){
            return v;
        }
    })

    return newData;
}

export class Categories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            pathDeleteGroup: URL_DELETE_GROUP,
            msgDeleteGroup: MSG_DELETE_GROUP,
            sessionName: "art.categorie.pagination"
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
    }

    handleGetData = (self) => { Formulaire.axiosGetDataPagination(self, Routing.generate('api_blog_categories_index'), Sort.compareName, this.state.perPage) }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, searchFunction) }

    handleContentList = (currentData, changeContext) => {
        return <CategoriesList onChangeContext={changeContext}
                               onDelete={this.layout.current.handleDelete}
                               onSearch={this.handleSearch}
                               onDeleteAll={this.layout.current.handleDeleteGroup}
                               data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        return <CategoryFormulaire type="create" onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <CategoryFormulaire type="update" element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}