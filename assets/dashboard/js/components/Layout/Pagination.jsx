import React, { Component } from 'react';
import ReactPaginate      from 'react-paginate';

import { Input, Select } from "@dashboardComponents/Tools/Fields";

function updateData(self, selectedPage, offset, items, perPage) {
    self.setState({ currentPage: selectedPage, offset: offset })
    self.props.onUpdate(items.slice(offset, offset + parseInt(perPage)))
    if(self.props.onChangeCurrentPage){
        self.props.onChangeCurrentPage(selectedPage)
    }
}

export class Pagination extends Component {
    constructor (props) {
        super(props)

        this.state = {
            offset: 0,
            inputPage: 0,
            currentPage: 0,
            perPage: props.perPage !== undefined ? props.perPage : 20,
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleComeback = this.handleComeback.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
    }

    componentDidMount() {
        sessionStorage.setItem(this.props.sessionName, "0");
    }

    handlePerPage = (perPage) => { this.setState({ perPage }) }

    handleClick = (e) => {
        const { perPage, items, sessionName } = this.props;

        const selectedPage = e.selected;
        const offset = selectedPage * perPage;

        if(items !== null){
            updateData(this, selectedPage, offset, items, perPage);
            sessionStorage.setItem(sessionName, selectedPage);
        }
    }

    handleComeback = () => {
        const { perPage, items, sessionName, currentPage } = this.props;

        if(currentPage){
            const selectedPage = localStorage.getItem(sessionName);
            const offset = selectedPage * perPage;

            updateData(this, selectedPage, offset, items, perPage);
        }
    }

    handlePageOne = (perP) => {
        const { perPage, items } = this.props;

        updateData(this, 0, 0, items, perP ? perP : perPage);
    }

    handleChange = (e) => {
        const { perPage, items, sessionName } = this.props;

        let selectedPage = 1;
        let offset = selectedPage * perPage;

        if(e.currentTarget.value !== ""){
            selectedPage = parseInt(e.currentTarget.value) - 1;
            offset = selectedPage * perPage;
        }

        if(items !== null){
            updateData(this, selectedPage, offset, items, perPage);
            this.setState({ inputPage: selectedPage });
        }
    }

    render () {
        const { havePagination, taille } = this.props;
        const { perPage, currentPage, inputPage } = this.state;

        let pageCount = Math.ceil(taille / perPage);

        let content = <>
            <PaginationView pageCount={pageCount} currentPage={currentPage} onClick={this.handleClick}/>
            {pageCount > 1 && <div className="input-page">
                <Input value={inputPage} identifant="inputPage" placeholder="Aller à la page.." errors={[]} onChange={this.handleChange} />
            </div>}
        </>

        return <>
            {havePagination && content}
        </>
    }
}

export function PaginationView ({ pageCount, currentPage, onClick }) {
    if(pageCount > 1){
        return <ReactPaginate
            previousLabel={<span className="icon-left-arrow" />}
            nextLabel={<span className="icon-right-arrow" />}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={onClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
            initialPage={parseInt(currentPage)}
            forcePage={parseInt(currentPage)}
        />
    }else{
        return null;
    }
}

export class TopSorterPagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sorter: 0,
            perPage: props.perPage,
            errors: []
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
        let name = e.currentTarget.name;
        let value = parseInt(e.currentTarget.value);

        if(name === "perPage"){
            this.props.onPerPage(value)
        }

        if(name === "sorter"){
            this.props.onSorter(value);
        }

        this.setState({ [name]: value })
    }

    render () {
        const { taille, currentPage, onClick, sorters } = this.props;
        const { sorter, perPage, errors } = this.state;

        let selectItems = [
            { value: 5, label: '5', identifiant: 'perpage-5' },
            { value: 10, label: '10', identifiant: 'perpage-10' },
            { value: 15, label: '15', identifiant: 'perpage-15' },
            { value: 20, label: '20', identifiant: 'perpage-20' },
            { value: 25, label: '25', identifiant: 'perpage-25' },
            { value: 30, label: '30', identifiant: 'perpage-30' },
            { value: 35, label: '35', identifiant: 'perpage-35' },
            { value: 40, label: '40', identifiant: 'perpage-40' },
            { value: 45, label: '45', identifiant: 'perpage-45' },
            { value: 50, label: '50', identifiant: 'perpage-50' },
        ]

        let pageCount = Math.ceil(taille / perPage);

        return <div className="sorter-pagination">
            <div className="actions-sorter">
                {sorters && <div className="line">
                    <Select noEmpty={true} items={sorters} identifiant="sorter" valeur={sorter} errors={errors} onChange={this.handleChange}>Trier par</Select>
                </div>}
            </div>

            <div className="actions-pagination">
                {onClick && <div className="line line-2">
                    <Select noEmpty={true} items={selectItems} identifiant="perPage" valeur={perPage} errors={errors} onChange={this.handleChange}>Nombre de résultats par page</Select>
                    <div className="pagination-container">
                        <PaginationView pageCount={pageCount} currentPage={currentPage} onClick={onClick}/>
                    </div>
                </div>}
            </div>
        </div>
    }
}