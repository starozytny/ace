import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { NotificationsList }      from "./NotificationsList";

const URL_DELETE_ELEMENT    = 'api_notifications_delete';
const URL_DELETE_GROUP      = 'api_notifications_delete_group';
const MSG_DELETE_ELEMENT    = 'Supprimer cette notification ?';
const MSG_DELETE_GROUP      = 'Aucune notification sélectionnée.';
const URL_IS_SEEN           = 'api_notifications_isSeen';
const SORTER = Sort.compareCreatedAt;

export class Notifications extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            pathDeleteGroup: URL_DELETE_GROUP,
            msgDeleteGroup: MSG_DELETE_GROUP,
            sessionName: "notifications.pagination"
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleSeen = this.handleSeen.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

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