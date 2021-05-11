import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Page }          from "@dashboardComponents/Layout/Page";
import { LoaderElement } from "@dashboardComponents/Layout/Loader";
import Sort              from "@dashboardComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { UserList }      from "./UserList";
import { UserCreate }    from "./UserCreate";
import { UserUpdate }    from "./UserUpdate";

export class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "list",
            loadPageError: false,
            loadData: true,
            data: null,
            currentData: null,
            element: null,
            filters: [],
            perPage: 10
        }

        this.page = React.createRef();

        this.handleUpdateData = this.handleUpdateData.bind(this);
        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
    }

    componentDidMount() { Formulaire.axiosGetDataPagination(this, Routing.generate('api_users_index'), this.state.perPage) }

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
        Formulaire.axiosDeleteElement(this, element, Routing.generate('api_users_delete', {'id': element.id}),
            'Supprimer cet utilisateur ?', 'Cette action est irréversible.');
    }
    handleDeleteGroup = () => {
        let checked = document.querySelectorAll('.i-selector:checked');
        Formulaire.axiosDeleteGroupElement(this, checked, Routing.generate('api_users_delete_group'), 'Aucun utilisateur sélectionné.')
    }

    handleGetFilters = (filters) => {
        const { dataImmuable, perPage } = this.state;

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

        sessionStorage.setItem("user.pagination", "0")
        this.page.current.pagination.current.handlePageOne();
        this.setState({ data: newData, currentData: newData.slice(0, perPage), filters: filters });
        return newData;
    }

    handleSearch = (search) => {
        const { filters, perPage } = this.state;

        let dataSearch = this.handleGetFilters(filters);

        if(search === "") {
            this.handleGetFilters(filters)
        }else{
            let newData = [];
            newData = dataSearch.filter(function(v) {
                if(v.username.toLowerCase().includes(search)
                    || v.email.toLowerCase().includes(search)
                    || v.firstname.toLowerCase().includes(search)
                    || v.lastname.toLowerCase().includes(search)
                ){
                    return v;
                }
            })
            this.setState({ data: newData, currentData: newData.slice(0, perPage) });
        }
    }

    render () {
        const { loadPageError, context, loadData, data, currentData, element, filters } = this.state;

        let content, havePagination = false;
        switch (context){
            case "create":
                content = <UserCreate onChangeContext={this.handleChangeContext} onUpdateList={this.handleUpdateList} />
                break;
            case "update":
                content =<UserUpdate onChangeContext={this.handleChangeContext} onUpdateList={this.handleUpdateList} element={element} />
                break;
            default:
                havePagination = true;
                content = loadData ? <LoaderElement /> : <UserList onChangeContext={this.handleChangeContext}
                                                                   onDelete={this.handleDelete}
                                                                   onGetFilters={this.handleGetFilters}
                                                                   filters={filters}
                                                                   onSearch={this.handleSearch}
                                                                   onDeleteAll={this.handleDeleteGroup}
                                                                   data={currentData} />
                break;
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