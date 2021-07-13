import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@dashboardComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { ContactList }      from "./ContactList";
import { ContactRead }      from "./ContactRead";

const URL_DELETE_ELEMENT = 'api_contact_delete';
const URL_DELETE_GROUP = 'api_contact_delete_group';
const URL_IS_SEEN = 'api_contact_isSeen';
const MSG_DELETE_ELEMENT = 'Supprimer ce message ?';
const MSG_DELETE_GROUP = 'Aucun message sélectionné.';
const SORTER = Sort.compareCreatedAt;

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
        this.handleContentRead = this.handleContentRead.bind(this);
        this.handleChangeContextRead = this.handleChangeContextRead.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees, SORTER); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext, SORTER); }

    handleDelete = (element) => {
        this.layout.current.handleDelete(this, element, Routing.generate(URL_DELETE_ELEMENT, {'id': element.id}), MSG_DELETE_ELEMENT);
    }

    handleDeleteGroup = () => {
        this.layout.current.handleDeleteGroup(this, Routing.generate(URL_DELETE_GROUP), MSG_DELETE_GROUP);
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
        Formulaire.isSeen(this, element, Routing.generate(URL_IS_SEEN, {'id': element.id}))
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentRead={this.handleContentRead} onChangeContextRead={this.handleChangeContextRead}/>
        </>
    }
}