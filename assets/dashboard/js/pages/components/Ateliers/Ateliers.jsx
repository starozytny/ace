import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Page }          from "@dashboardComponents/Layout/Page";
import { LoaderElement } from "@dashboardComponents/Layout/Loader";
import Sort              from "@commonComponents/functions/sort";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { AteliersList }  from "./AteliersList";
import { AtelierUpdate } from "./AtelierUpdate";
import { AtelierCreate } from "./AtelierCreate";

const SORTER = Sort.compareName;

export class Ateliers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "list",
            loadPageError: false,
            loadData: true,
            data: null,
            currentData: null,
            element: null,
            perPage: 10,
            sorter: SORTER
        }

        this.page = React.createRef();

        this.handleUpdateData = this.handleUpdateData.bind(this);
        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
    }

    componentDidMount() { Formulaire.axiosGetDataPagination(this, Routing.generate('api_ateliers_index'), SORTER, this.state.perPage) }

    handleUpdateData = (data) => { this.setState({ currentData: data })  }

    handleUpdateList = (element, newContext=null) => {
        const { data, dataImmuable, currentData, context, perPage } = this.state;

        let newData = Formulaire.updateDataPagination(SORTER, newContext, context, data, element, perPage);
        let newDataImmuable = Formulaire.updateDataPagination(SORTER, newContext, context, dataImmuable, element, perPage);
        let newCurrentData = Formulaire.updateDataPagination(SORTER, newContext, context, currentData, element, perPage);

        this.setState({
            data: newData,
            dataImmuable: newDataImmuable,
            currentData: newCurrentData,
            element: element
        })
    }

    handleChangeContext = (context, element=null) => {
        this.setState({ context, element });
        if(context === "list"){
            this.page.current.pagination.current.handleComeback()
        }
    }

    handleDelete = (element) => {
        Formulaire.axiosDeleteElement(this, element, Routing.generate('api_ateliers_delete', {'id': element.id}),
            'Supprimer cet atelier ?', 'Cette action est irréversible.');
    }
    handleDeleteGroup = () => {
        let checked = document.querySelectorAll('.i-selector:checked');
        Formulaire.axiosDeleteGroupElement(this, checked, Routing.generate('api_ateliers_delete_group'), 'Aucun atelier sélectionné.')
    }

    render () {
        const { loadPageError, context, loadData, data, currentData, element } = this.state;

        let content, havePagination = false;
        switch (context){
            case "create":
                content = <AtelierCreate onChangeContext={this.handleChangeContext} onUpdateList={this.handleUpdateList} />
                break;
            case "update":
                content = <AtelierUpdate onChangeContext={this.handleChangeContext} onUpdateList={this.handleUpdateList} element={element}/>
                break;
            default:
                havePagination = true;
                content = loadData ? <LoaderElement /> : <AteliersList onChangeContext={this.handleChangeContext}
                                                                   onDelete={this.handleDelete}
                                                                   onDeleteAll={this.handleDeleteGroup}
                                                                   data={currentData} />
                break;
        }

        if(data && data.length <= 0){
            havePagination = false;
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