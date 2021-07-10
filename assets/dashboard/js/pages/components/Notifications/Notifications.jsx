import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@dashboardComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { NotificationsList }      from "./NotificationsList";

const URL_DELETE_ELEMENT = 'api_notifications_delete';
const URL_DELETE_GROUP = 'api_notifications_delete_group';
const URL_IS_SEEN = 'api_notifications_isSeen';
const MSG_DELETE_ELEMENT = 'Supprimer cette notification ?';
const MSG_DELETE_GROUP = 'Aucune notification sélectionnée.';
const SORTER = Sort.compareCreatedAt;

export class Notifications extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            sessionName: "notifications.pagination"
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleSeen = this.handleSeen.bind(this);
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
        return <NotificationsList onChangeContext={changeContext}
                                  onDelete={this.handleDelete}
                                  onDeleteAll={this.handleDeleteGroup}
                                  onSeen={this.handleSeen}
                                  data={currentData} />
    }

    handleSeen = (element) => { Formulaire.isSeen(this, element, Routing.generate(URL_IS_SEEN, {'id': element.id})) }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList} />
        </>
    }
}