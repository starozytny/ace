import React, { Component } from 'react';


import { Layout }   from "@dashboardComponents/Layout/Page";

import { BlogList } from "@userPages/components/Blog/BlogList";

export class Blog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sessionName: "us.blog.art.pagination",
            isFromApp: props.isFromApp ? props.isFromApp : false
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleContentList = (currentData, changeContext) => {
        return <BlogList onChangeContext={changeContext} data={currentData} isFromApp={this.state.isFromApp} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}/>
        </>
    }
}