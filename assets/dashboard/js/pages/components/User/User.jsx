import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@dashboardComponents/functions/sort";

import { UserList }       from "./UserList";
import { UserRead }       from "./UserRead";
import { UserFormulaire } from "./UserForm";

const URL_DELETE_ELEMENT = 'api_users_delete';
const URL_DELETE_GROUP = 'api_users_delete_group';
const MSG_DELETE_ELEMENT = 'Supprimer cet utilisateur ?';
const MSG_DELETE_GROUP = 'Aucun utilisateur sélectionné.';
const SORTER = Sort.compareLastname;

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

        this.state = {
            perPage: 10,
            sessionName: "user.pagination"
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
        this.handleContentRead = this.handleContentRead.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees, SORTER); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext, SORTER); }

    handleDelete = (element) => {
        this.layout.current.handleDelete(this, element, Routing.generate(URL_DELETE_ELEMENT, {'id': element.id}), MSG_DELETE_ELEMENT);
    }

    handleDeleteGroup = () => {
        this.layout.current.handleDeleteGroup(this, Routing.generate(URL_DELETE_GROUP), MSG_DELETE_GROUP);
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

    handleContentRead = (changeContext, element) => {
        return <UserRead elem={element} onChangeContext={changeContext}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList} onContentRead={this.handleContentRead}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}