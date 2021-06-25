import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@dashboardComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { NotificationsList }      from "./NotificationsList";

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

    handleGetData = (self) => { Formulaire.axiosGetDataPagination(self, Routing.generate('api_notifications_index'), Sort.compareCreatedAt, this.state.perPage) }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext, Sort.compareCreatedAt); }

    handleDelete = (element) => {
        Formulaire.axiosDeleteElement(this, element, Routing.generate('api_notifications_delete', {'id': element.id}),
            'Supprimer cette notification ?', 'Cette action est irréversible.');
    }
    handleDeleteGroup = () => {
        let checked = document.querySelectorAll('.i-selector:checked');
        Formulaire.axiosDeleteGroupElement(this, checked, Routing.generate('api_notifications_delete_group'), 'Aucune notification sélectionnée.')
    }

    handleContentList = (currentData, changeContext) => {
        return <NotificationsList onChangeContext={changeContext}
                                  onDelete={this.handleDelete}
                                  onDeleteAll={this.handleDeleteGroup}
                                  onSeen={this.handleSeen}
                                  data={currentData} />
    }

    handleSeen = (element) => { Formulaire.isSeen(this, element, Routing.generate('api_notifications_isSeen', {'id': element.id})) }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList} />
        </>
    }
}