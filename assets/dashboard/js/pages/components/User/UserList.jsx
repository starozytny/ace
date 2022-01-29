import React, { Component } from 'react';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import {Button, ButtonIcon, ButtonIconDropdown} from "@dashboardComponents/Tools/Button";
import { Filter, FilterSelected }   from "@dashboardComponents/Layout/Filter";
import { TopSorterPagination }      from "@dashboardComponents/Layout/Pagination";
import { Search }                   from "@dashboardComponents/Layout/Search";
import { Alert }                    from "@dashboardComponents/Tools/Alert";

import { UserItem }   from "./UserItem";

export class UserList extends Component {
    constructor(props) {
        super(props);

        this.filter = React.createRef();

        this.handleFilter = this.handleFilter.bind(this);
    }

    handleFilter = (e) => {
        this.filter.current.handleChange(e, true);
    }

    render () {
        const { taille, data, perPage, onChangeContext, onGetFilters, filters, onSearch, onDeleteAll, onPerPage,
            onPaginationClick, currentPage, sorters, onSorter } = this.props;

        let filtersLabel = ["Utilisateur", "Développeur", "Administrateur"];
        let filtersId    = ["f-user", "f-dev", "f-admin"];

        let itemsFilter = [
            { value: 0, id: filtersId[0], label: filtersLabel[0]},
            { value: 1, id: filtersId[1], label: filtersLabel[1] },
            { value: 2, id: filtersId[2], label: filtersLabel[2]}
        ];

        let dropdownItems = [
            {data: <a className="item" download="utilisateurs.csv" href={Routing.generate('api_users_export', {'format': 'csv'})}>
                    <ButtonIcon icon="file" text="Exporter en CSV" />
                </a>},
            {data: <a className="item" download="utilisateurs.xlsx" href={Routing.generate('api_users_export', {'format': 'excel'})}>
                    <ButtonIcon icon="file" text="Exporter en Excel" />
                </a>}
        ]

        return <>
            <div>
                <div className="toolbar">
                    <div className="item create">
                        <Button onClick={() => onChangeContext("create")}>Ajouter un utilisateur</Button>
                    </div>
                    <div className="item filter-search">
                        <Filter ref={this.filter} items={itemsFilter} onGetFilters={onGetFilters} />
                        <Search onSearch={onSearch} placeholder="Recherche par identifiant, nom, prénom ou email.."/>
                        <FilterSelected filters={filters} itemsFiltersLabel={filtersLabel} itemsFiltersId={filtersId} onChange={this.handleFilter}/>
                    </div>
                </div>

                <TopSorterPagination sorters={sorters} onSorter={onSorter}
                                     currentPage={currentPage} perPage={perPage} onPerPage={onPerPage} taille={taille} onClick={onPaginationClick}/>

                <div className="items-table">
                    <div className="items items-default items-user">
                        <div className="item item-header">
                            <div className="item-header-selector" />
                            <div className="item-content">
                                <div className="item-body item-body-image">
                                    <div className="infos infos-col-3">
                                        <div className="col-1">Nom/Prénom</div>
                                        <div className="col-2">Identifiant</div>
                                        <div className="col-3 actions">Actions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <UserItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
                {(data && data.length !== 0) && <div className="page-actions">
                    <div className="selectors-actions">
                        <div className="item" onClick={onDeleteAll}>
                            <ButtonIcon icon="trash" text="Supprimer la sélection" />
                        </div>
                    </div>
                    <div className="common-actions">
                        <div className="item">
                            <ButtonIconDropdown icon="download" text="Exporter" items={dropdownItems} />
                        </div>
                    </div>
                </div>}
            </div>
        </>
    }
}