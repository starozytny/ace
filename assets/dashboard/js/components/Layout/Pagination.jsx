import React, {Component} from 'react';
import ReactPaginate      from 'react-paginate';

import { Input } from "@dashboardComponents/Tools/Fields";

export class Pagination extends Component {
    constructor (props) {
        super(props)

        this.state = {
            offset: 0,
            inputPage: 0,
            currentPage: 0,
            perPage: props.perPage !== undefined ? props.perPage : 20
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleComeback = this.handleComeback.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        sessionStorage.setItem('user.pagination', "0");
    }

    handleClick = (e) => {
        const { perPage, items } = this.props;

        const selectedPage = e.selected;
        const offset = selectedPage * perPage;

        if(items !== null){
            this.setState({ currentPage: selectedPage, offset: offset })
            this.props.onUpdate(items.slice(offset, offset + parseInt(perPage)))
            sessionStorage.setItem('user.pagination', selectedPage);
        }
    }

    handleComeback = () => {
        const { perPage, items } = this.props;

        const selectedPage = localStorage.getItem('user.pagination');
        const offset = selectedPage * perPage;

        this.setState({ currentPage: selectedPage, offset: offset })
        this.props.onUpdate(items.slice(offset, offset + parseInt(perPage)))
    }

    handlePageOne = () => {
        const { perPage, items } = this.props;

        const offset = 0;

        this.setState({ currentPage: 0, offset: offset })
        this.props.onUpdate(items.slice(offset, offset + parseInt(perPage)))
    }

    handleChange = (e) => {
        const { perPage, items } = this.props;

        let selectedPage = 1;
        let offset = selectedPage * perPage;

        if(e.currentTarget.value !== ""){
            selectedPage = parseInt(e.currentTarget.value) - 1;
            offset = selectedPage * perPage;
        }

        if(items !== null){
            this.setState({ inputPage: selectedPage, currentPage: selectedPage, offset: offset })
            this.props.onUpdate(items.slice(offset, offset + parseInt(perPage)))
            sessionStorage.setItem('user.pagination', e.currentTarget.value);
        }
    }

    render () {
        const { havePagination, taille } = this.props
        const { perPage, currentPage, inputPage } = this.state

        let pageCount = Math.ceil(taille / perPage);

        let content = <>
            <ReactPaginate
                previousLabel={<span className="icon-left-arrow" />}
                nextLabel={<span className="icon-right-arrow" />}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={this.handleClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
                initialPage={parseInt(currentPage)}
                forcePage={parseInt(currentPage)}
            />
            {pageCount > 1 && <div className="input-page">
                <Input value={inputPage} identifant="inputPage" placeholder="Aller à la page.." errors={[]} onChange={this.handleChange} />
            </div>}
        </>

        return <>
            {havePagination && content}
        </>
    }
}
