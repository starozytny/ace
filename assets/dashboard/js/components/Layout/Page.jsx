import React, { Component } from 'react';

import { PageError }        from "./PageError";
import { Pagination }       from "./Pagination";
import { LoaderElement }    from "@dashboardComponents/Layout/Loader";

import Formulaire           from "@dashboardComponents/functions/Formulaire";

export class Page extends Component {
    constructor(props) {
        super(props);

        this.pagination = React.createRef();
    }

    render () {
        const { haveLoadPageError, children, sessionName,
            havePagination, perPage = "10", taille, data,
        } = this.props;

        let hPagination = (havePagination && data && data.length !== 0);

        return <>
            {haveLoadPageError && <PageError />}
            <div className="main-content">
                {children}
                <Pagination ref={this.pagination} havePagination={hPagination} perPage={perPage} taille={taille} items={data}
                            onUpdate={(items) => this.props.onUpdate(items)} sessionName={sessionName}/>
            </div>

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
            currentData: null,
            element: null,
            filters: [],
            perPage: props.perPage,
            sessionName: props.sessionName
        }

        this.page = React.createRef();

        this.handleUpdateData = this.handleUpdateData.bind(this);
        this.handleChangeContext = this.handleChangeContext.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);
    }

    componentDidMount() { this.props.onGetData(this); }

    handleUpdateData = (data) => { this.setState({ currentData: data })  }

    handleChangeContext = (context, element=null) => {
        const { onChangeContextRead } = this.props;

        this.setState({ context, element });
        if(context === "list"){
            this.page.current.pagination.current.handleComeback()
        }else if(context === "read"){
            onChangeContextRead(element)
        }
    }

    handleUpdateList = (element, newContext = null, sorter = null) => {
        const { data, context, perPage } = this.state
        Formulaire.updateDataPagination(this, sorter, newContext, context, data, element, perPage);
    }

    handleSearch = (search, searchFunction, haveFilter = false, filterFunction) => {
        const { dataImmuable, filters, perPage } = this.state;

        if(!haveFilter){
            if(search === "") {
                this.setState({ data: dataImmuable, currentData: dataImmuable.slice(0, perPage) });
            }else{
                let newData = searchFunction(dataImmuable, search);
                this.setState({ data: newData, currentData: newData.slice(0, perPage) });
            }
        }else{
            let dataSearch = this.handleGetFilters(filters, filterFunction);
            if(search === "") {
                this.handleGetFilters(filters, filterFunction)
            }else{
                let newData = searchFunction(dataSearch, search);
                this.setState({ data: newData, currentData: newData.slice(0, perPage) });
            }
        }
    }

    handleGetFilters = (filters, filterFunction) => {
        const { dataImmuable, perPage, sessionName } = this.state;

        let newData = filterFunction(dataImmuable, filters);

        sessionStorage.setItem(sessionName, "0")
        this.page.current.pagination.current.handlePageOne();
        this.setState({ data: newData, currentData: newData.slice(0, perPage), filters: filters });
        return newData;
    }

    render () {
        const { onContentList, onContentCreate, onContentUpdate, onContentRead } = this.props;
        const { loadPageError, context, loadData, data, currentData, element, sessionName, filters } = this.state;

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
            default:
                havePagination = true;
                content = loadData ? <LoaderElement /> : onContentList(currentData, this.handleChangeContext, this.handleGetFilters, filters)
                break;
        }

        if(data && data.length <= 0){
            havePagination = false;
        }

        return <>
            <Page ref={this.page} haveLoadPageError={loadPageError} sessionName={sessionName}
                  havePagination={havePagination} taille={data && data.length} data={data} onUpdate={this.handleUpdateData}
            >
                {content}
            </Page>
        </>
    }
}