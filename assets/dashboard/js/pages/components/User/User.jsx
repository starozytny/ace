import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@dashboardComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { UserList }       from "./UserList";
import { UserFormulaire } from "./UserForm";

function searchFunction(dataImmuable, search){
    let newData = [];
    newData = dataImmuable.filter(function(v) {
        if(v.username.toLowerCase().includes(search)
            || v.email.toLowerCase().includes(search)
            || v.firstname.toLowerCase().includes(search)
            || v.lastname.toLowerCase().includes(search)
        ){
            return v;
        }
    })

    return newData;
}

function filterFunction(dataImmuable, filters){
    let newData = [];
    if(filters.length === 0) {
        newData = dataImmuable
    }else{
        dataImmuable.forEach(el => {
            filters.forEach(filter => {
                if(filter === el.highRoleCode){
                    newData.filter(elem => elem.id !== el.id)
                    newData.push(el);
                }
            })
        })
    }

    return newData;
}

export class User extends Component {
    constructor(props) {
        super(props);

        let data = JSON.parse(props.donnees);
        data.sort(Sort.compareLastname);

        this.state = {
            perPage: 10,
            sessionName: "user.pagination",
            data: data
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
    }

    handleGetData = (self) => {
        const { data, perPage } = this.state;

        self.setState({ dataImmuable: data, data: data, currentData: data.slice(0, perPage), loadPageError: false, loadData: false });
    }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext, Sort.compareLastname); }

    handleDelete = (element) => {
        Formulaire.axiosDeleteElement(this, element, Routing.generate('api_users_delete', {'id': element.id}),
            'Supprimer cet utilisateur ?', 'Cette action est irréversible.');
    }
    handleDeleteGroup = () => {
        let checked = document.querySelectorAll('.i-selector:checked');
        Formulaire.axiosDeleteGroupElement(this, checked, Routing.generate('api_users_delete_group'), 'Aucun utilisateur sélectionné.')
    }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, filterFunction); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, searchFunction, true, filterFunction); }

    handleContentList = (currentData, changeContext, getFilters, filters) => {
        return <UserList onChangeContext={changeContext}
                         onDelete={this.handleDelete}
                         onGetFilters={this.handleGetFilters}
                         onSearch={this.handleSearch}
                         onDeleteAll={this.handleDeleteGroup}
                         filters={filters}
                         data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        return <UserFormulaire type="create" onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <UserFormulaire type="update" element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}