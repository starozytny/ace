import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import {Layout }         from "@dashboardComponents/Layout/Page";
import Sort              from "@dashboardComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { CategoriesList }     from "./CategoriesList";
import { CategoryFormulaire } from "./CategoryForm";

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
            perPage: 10
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
    }

    handleGetData = (self) => { Formulaire.axiosGetDataPagination(self, Routing.generate('api_blog_categories_index'), Sort.compareName, this.state.perPage) }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleSearch(element, newContext, Sort.compareName); }

    handleDelete = (element) => {
        Formulaire.axiosDeleteElement(this, element, Routing.generate('api_blog_categories_delete', {'id': element.id}),
            'Supprimer cette catégorie ?', 'Cette action est irréversible.');
    }
    handleDeleteGroup = () => {
        let checked = document.querySelectorAll('.i-selector:checked');
        Formulaire.axiosDeleteGroupElement(this, checked, Routing.generate('api_blog_categories_delete_group'), 'Aucune catégorie sélectionnée.')
    }

    handleSearch = (search) => { this.layout.current.handleSearch(search, searchFunction) }

    handleContentList = (currentData, changeContext) => {
        return <CategoriesList onChangeContext={changeContext}
                               onDelete={this.handleDelete}
                               onSearch={this.handleSearch}
                               onDeleteAll={this.handleDeleteGroup}
                               data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        return <CategoryFormulaire type="create" onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, updateList, element) => {
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