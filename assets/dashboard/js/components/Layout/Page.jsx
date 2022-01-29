import React, { Component } from 'react';

import Routing              from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { PageError }        from "./PageError";
import { Pagination }       from "./Pagination";
import { LoaderElement }    from "@dashboardComponents/Layout/Loader";

import Search               from "@commonComponents/functions/search";
import Formulaire           from "@dashboardComponents/functions/Formulaire";

export class Page extends Component {
    constructor(props) {
        super(props);

        this.pagination = React.createRef();

        this.handlePerPage = this.handlePerPage.bind(this);
    }

    handlePerPage = (perPage) => { this.pagination.current.handlePerPage(perPage); }

    render () {
        const { classes="main-content", haveLoadPageError, children, sessionName, havePagination,
            perPage = "10", taille, data, onChangeCurrentPage } = this.props;

        let hPagination = (havePagination && data && data.length !== 0);

        return <>
            {haveLoadPageError ? <PageError /> : <div className={classes}>
                {children}
                <Pagination ref={this.pagination} havePagination={hPagination} perPage={perPage} taille={taille} items={data}
                            onUpdate={(items) => this.props.onUpdate(items)} sessionName={sessionName}
                            onChangeCurrentPage={onChangeCurrentPage}/>
            </div>}
        </>
    }
}

export class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "list",
            loadPageError: false,
            loadData: true,
            data: null,
            dataImmuable: null,
            currentData: null,
            element: null,
            filters: [],
            classes: props.classes ? props.classes : "main-content",
            sorter: props.sorter ? props.sorter : null,
            perPage: props.perPage,
            sessionName: props.sessionName,
            search: props.search ? props.search : null
        }

        this.page = React.createRef();

        this.handleUpdateData = this.handleUpdateData.bind(this);
        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);
        this.handleSetDataPagination = this.handleSetDataPagination.bind(this);
        this.handleSetData = this.handleSetData.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
        this.handleSwitchPublished = this.handleSwitchPublished.bind(this);
        this.handleSwitchData = this.handleSwitchData.bind(this);
        this.handleUpdatePerPage = this.handleUpdatePerPage.bind(this);
        this.handleGetPaginationClick = this.handleGetPaginationClick.bind(this);
    }

    componentDidMount() { this.props.onGetData(this); }

    handleUpdateData = (data) => { this.setState({ currentData: data })  }

    handleChangeContext = (context, element=null) => {
        const { onChangeContextRead } = this.props;

        this.setState({ context, element });
        if(context === "list"){
            this.page.current.pagination.current.handleComeback()
        }else if(context === "read"){
            if(onChangeContextRead){
                onChangeContextRead(element);
            }
        }
    }

    handleUpdateList = (element, newContext = null) => {
        const { data, dataImmuable, currentData, context, perPage, sorter} = this.state

        let newData = Formulaire.updateDataPagination(sorter, newContext, context, data, element, perPage);
        let newDataImmuable = Formulaire.updateDataPagination(sorter, newContext, context, dataImmuable, element, perPage);
        let newCurrentData = Formulaire.updateDataPagination(sorter, newContext, context, currentData, element, perPage);

        this.setState({
            data: newData,
            dataImmuable: newDataImmuable,
            currentData: newCurrentData,
            element: element
        })
    }

    handleUpdatePerPage = (sorter = null, perPage) => {
        const { data } = this.state;

        this.page.current.handlePerPage(perPage);
        Formulaire.updatePerPage(this, sorter, data, perPage);
        this.page.current.pagination.current.handlePageOne(perPage);
    }

    handleSetDataPagination = (donnees, nContext = "read", type = "id", filters = null, filterFunction = null) => {
        const { context, perPage, search, sorter } = this.state;

        let elements = getData(donnees, sorter, search, type, context, nContext);

        let data = elements[0];
        let dataImmuable = elements[1];
        let elem = elements[2];
        let newContext = elements[3];

        if(filters){
            data = this.handleGetFilters(filters, filterFunction, data)
        }

        this.setState({ context: newContext, dataImmuable: dataImmuable, data: data, currentData: data.slice(0, perPage),
            loadPageError: false, loadData: false, element: elem })
    }

    handleSetData = (donnees, nContext = "read", type = "id") => {
        const { context, search, sorter } = this.state;

        let elements = getData(donnees, sorter, search, type, context, nContext);

        let data = elements[0]; // 1 = immuable
        let elem = elements[2];
        let newContext = elements[3];

        this.setState({ context: newContext, data: data, loadPageError: false, loadData: false, element: elem })
    }

    handleSearch = (search, type, haveFilter = false, filterFunction) => {
        const { dataImmuable, filters, perPage, sorter } = this.state;

        let d = dataImmuable
        if(!haveFilter){
            if(search === "") {
                this.setState({ data: dataImmuable, currentData: dataImmuable.slice(0, perPage) });
            }
        }else{
            let dataSearch = this.handleGetFilters(filters, filterFunction);
            if(search === "") {
                this.handleGetFilters(filters, filterFunction)
            }else{
                d = dataSearch
            }
        }

        if(search !== ""){
            let newData = Search.search(type, d, search);
            if(sorter){
                newData.sort(sorter)
            }
            this.setState({ data: newData, currentData: newData.slice(0, perPage) });
        }
    }

    handleGetFilters = (filters, filterFunction, dataIm = null) => {
        const { dataImmuable, perPage, sessionName, sorter } = this.state;

        let newData = filterFunction(dataIm ? dataIm : dataImmuable, filters);
        if(sorter){
            newData.sort(sorter)
        }

        if(dataIm == null){
            sessionStorage.setItem(sessionName, "0")
            this.page.current.pagination.current.handlePageOne();
        }

        this.setState({ data: newData, currentData: newData.slice(0, perPage), filters: filters });
        return newData;
    }

    handleDelete = (element, text='Cette action est irréversible.') => {
        const { pathDeleteElement, urlDeleteElement, msgDeleteElement } = this.props;

        let url = urlDeleteElement ? urlDeleteElement : Routing.generate(pathDeleteElement, {'id': element.id})
        Formulaire.axiosDeleteElement(this, element, url, msgDeleteElement, text);
    }

    handleDeleteGroup = () => {
        const { pathDeleteGroup, urlDeleteGroup, msgDeleteGroup } = this.props;

        let checked = document.querySelectorAll('.i-selector:checked');
        let url = urlDeleteGroup ? urlDeleteGroup : Routing.generate(pathDeleteGroup)
        Formulaire.axiosDeleteGroupElement(this, checked, url, msgDeleteGroup)
    }

    handleSwitchPublished = (self, element, url, nameEntity) => {
        Formulaire.switchPublished(self, element, url, nameEntity);
    }

    handleSwitchData = (self, elementValue, url, nameEntity, txtOff=" en ligne", txtOn=" archivé") => {
        Formulaire.switchFunction(self, elementValue, url, nameEntity, txtOff, txtOn);
    }

    handleGetPaginationClick = (self) => { return self.layout.current.page.current.pagination.current.handleClick; }

    render () {
        const { onContentList, onContentCreate, onContentUpdate, onContentRead, onContentCustomOne, onContentCustomTwo,
            onChangeCurrentPage, classes } = this.props;
        const { perPage, loadPageError, context, loadData, data, currentData, element, sessionName, filters } = this.state;

        let content, havePagination = false;
        switch (context){
            case "create":
                content = onContentCreate(this.handleChangeContext)
                break;
            case "update":
                content = onContentUpdate(this.handleChangeContext, element)
                break;
            case "read":
                content = onContentRead(this.handleChangeContext, element)
                break;
            case "customOne":
                content = onContentCustomOne(this.handleChangeContext, element)
                break;
            case "customTwo":
                content = onContentCustomTwo(this.handleChangeContext, element)
                break;
            default:
                havePagination = true;
                content = loadData ? <LoaderElement /> : onContentList(currentData, this.handleChangeContext, this.handleGetFilters, filters, data)
                break;
        }

        if(data && data.length <= 0){
            havePagination = false;
        }

        return <>
            <Page ref={this.page} classes={classes} haveLoadPageError={loadPageError} sessionName={sessionName} perPage={perPage}
                  havePagination={havePagination} taille={data && data.length} data={data} onUpdate={this.handleUpdateData}
                  onChangeCurrentPage={onChangeCurrentPage}
            >
                {content}
            </Page>
        </>
    }
}


function initData(donnees, sorter)
{
    let data = JSON.parse(donnees);
    if(sorter){
        data.sort(sorter);
    }

    return data;
}

function initPageWithSearch(data, search, type, context, nContext)
{
    let newContext = context;
    let elem = null;
    if(search){
        data.forEach(el => {
            let find = false;
            if(type === "username"){
                if(el.username === search){
                    find = true;
                }
            }else if(type === "id"){
                if(el.id === parseInt(search)){
                    find = true;
                }
            }

            if(find){
                elem = el;
                newContext = nContext;
            }
        })
    }

    return [elem, newContext];
}

function getData(donnees, sorter, search, type, context, nContext)
{
    let data = initData(donnees, sorter);
    let dataImmuable = initData(donnees, sorter);

    let element = initPageWithSearch(data, search, type, context, nContext);
    let elem = element[0];
    let newContext = element[1];

    return [data, dataImmuable, elem, newContext];
}