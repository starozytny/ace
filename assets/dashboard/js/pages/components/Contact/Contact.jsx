import React, { Component } from 'react';

import axios             from "axios";
import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@dashboardComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { ContactList }      from "./ContactList";
import { ContactRead }      from "./ContactRead";

export class Contact extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            sessionName: "contact.pagination"
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleChangeContextRead = this.handleChangeContextRead.bind(this);
    }

    handleGetData = (self) => { Formulaire.axiosGetDataPagination(self, Routing.generate('api_contact_index'), Sort.compareCreatedAt, this.state.perPage) }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext, Sort.compareCreatedAt); }

    handleDelete = (element) => {
        Formulaire.axiosDeleteElement(this, element, Routing.generate('api_contact_delete', {'id': element.id}),
            'Supprimer ce message ?', 'Cette action est irréversible.');
    }
    handleDeleteGroup = () => {
        let checked = document.querySelectorAll('.i-selector:checked');
        Formulaire.axiosDeleteGroupElement(this, checked, Routing.generate('api_contact_delete_group'), 'Aucun message sélectionné.')
    }

    handleContentList = (currentData, changeContext) => {
        return <ContactList onChangeContext={changeContext}
                            onDelete={this.handleDelete}
                            onDeleteAll={this.handleDeleteGroup}
                            data={currentData} />
    }

    handleContentRead = (changeContext, element) => {
        return <ContactRead element={element} onChangeContext={changeContext}/>
    }

    handleChangeContextRead = (element) => {
        if(!element.isSeen){
            const self = this;
            axios.post(Routing.generate('api_contact_isSeen', {'id': element.id}), {})
                .then(function (response) {
                    let data = response.data;
                    self.handleUpdateList(data, 'update');
                })
                .catch(function (error) {
                    Formulaire.displayErrors(self, error)
                })
            ;
        }
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentRead={this.handleContentRead} onChangeContextRead={this.handleChangeContextRead}/>
        </>
    }
}