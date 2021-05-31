import React, { Component } from 'react';

import axios             from "axios";
import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Page }          from "@dashboardComponents/Layout/Page";
import { LoaderElement } from "@dashboardComponents/Layout/Loader";
import Sort              from "@dashboardComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { ContactList }      from "./ContactList";
import {ContactRead} from "./ContactRead";

export class Contact extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "list",
            loadPageError: false,
            loadData: true,
            data: null,
            currentData: null,
            element: null,
            perPage: 10
        }

        this.page = React.createRef();

        this.handleUpdateData = this.handleUpdateData.bind(this);
        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
    }

    componentDidMount() { Formulaire.axiosGetDataPagination(this, Routing.generate('api_contact_index'), Sort.compareCreatedAt, this.state.perPage) }

    handleUpdateData = (data) => { this.setState({ currentData: data })  }

    handleUpdateList = (element, newContext=null) => {
        const { data, context, perPage } = this.state
        Formulaire.updateDataPagination(this, Sort.compareCreatedAt, newContext, context, data, element, perPage);
    }

    handleChangeContext = (context, element=null) => {
        this.setState({ context, element });
        if(context === "list"){
            this.page.current.pagination.current.handleComeback()
        }else if(context === "read"){

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
    }

    handleDelete = (element) => {
        Formulaire.axiosDeleteElement(this, element, Routing.generate('api_contact_delete', {'id': element.id}),
            'Supprimer ce message ?', 'Cette action est irréversible.');
    }
    handleDeleteGroup = () => {
        let checked = document.querySelectorAll('.i-selector:checked');
        Formulaire.axiosDeleteGroupElement(this, checked, Routing.generate('api_contact_delete_group'), 'Aucun message sélectionné.')
    }

    render () {
        const { loadPageError, context, loadData, data, currentData, element } = this.state;

        let content, havePagination = false;
        switch (context){
            case 'read':
                content = <ContactRead element={element} onChangeContext={this.handleChangeContext}/>
                break;
            default:
                havePagination = true;
                content = loadData ? <LoaderElement /> : <ContactList onChangeContext={this.handleChangeContext}
                                                                      onDelete={this.handleDelete}
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