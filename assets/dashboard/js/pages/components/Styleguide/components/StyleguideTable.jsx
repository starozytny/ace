import React from "react";

import { ButtonIcon } from "@dashboardComponents/Tools/Button";
import { Selector } from "@dashboardComponents/Layout/Selector";

export function StyleguideTable () {
    let data = [
        { id: 0, name: "John Doe", role: 'Administrateur', username: "john_doe", email: 'john_doe@hotmail.fr', when: "Il y a 5 minutes" },
        { id: 2, name: "Jean Dave", role: 'Utilisateur', username: "jean_dave", email: 'jean_dave@gmail.com', when: "Il y a 5 minutes" },
        { id: 3, name: "Eva Aleksandar", role: 'Manager', username: "eva_aleksandar", email: 'eva_aleksandar@outlook.fr', when: "Il y a 5 minutes" },
        { id: 4, name: "Halo Lab", role: 'Utilisateur', username: "halo_lab", email: 'halo_lab@sfr.fr', when: "Il y a 5 minutes" },
    ]
    return (
        <section>
            <h2>Tables</h2>
            <TableCol2Image data={data} />
            <TableCol3Image data={data} />
            <TableCol4Image data={data} />
            <TableCol2 data={data} />
            <TableCol3 data={data} />
            <TableCol4 data={data} />
            <TableCol5 data={data} />
        </section>
    )
}

function TableCol2 ({ data }) {
    return (<div className="items-table">
        <div className="items items-default">
            <div className="item item-header">
                <div className="item-header-selector" />
                <div className="item-content">
                    <div className="item-body">
                        <div className="infos infos-col-2">
                            <div className="col-1">Nom</div>
                            <div className="col-2 actions">Actions</div>
                        </div>
                    </div>
                </div>
            </div>
            {data.map(el => {
                return (<div className="item" key={el.id}>
                    <Selector />

                    <div className="item-content">
                        <div className="item-body">
                            <div className="infos infos-col-2">
                                <div className="col-1">
                                    <div className="name">
                                        <span>{el.name}</span>
                                        <span className="role">{el.role}</span>
                                    </div>
                                </div>
                                <div className="col-2 actions">
                                    <ButtonIcon icon="pencil">Modifier</ButtonIcon>
                                    <ButtonIcon icon="trash">Supprimer</ButtonIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
            })}
        </div>
    </div>)
}

function TableCol3 ({ data }) {
    return (<div className="items-table">
        <div className="items items-default">
            <div className="item item-header">
                <div className="item-header-selector" />
                <div className="item-content">
                    <div className="item-body">
                        <div className="infos infos-col-3">
                            <div className="col-1">Nom</div>
                            <div className="col-2">Email</div>
                            <div className="col-3 actions">Actions</div>
                        </div>
                    </div>
                </div>
            </div>
            {data.map(el => {
                return (<div className="item" key={el.id}>
                    <Selector />

                    <div className="item-content">
                        <div className="item-body">
                            <div className="infos infos-col-3">
                                <div className="col-1">
                                    <div className="name">
                                        <span>{el.name}</span>
                                        <span className="role">{el.role}</span>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="sub">{el.email}</div>
                                </div>
                                <div className="col-3 actions">
                                    <ButtonIcon icon="pencil">Modifier</ButtonIcon>
                                    <ButtonIcon icon="trash">Supprimer</ButtonIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
            })}
        </div>
    </div>)
}

function TableCol4 ({ data }) {
    return (<div className="items-table">
        <div className="items items-default">
            <div className="item item-header">
                <div className="item-header-selector" />
                <div className="item-content">
                    <div className="item-body">
                        <div className="infos infos-col-4">
                            <div className="col-1">Nom</div>
                            <div className="col-2">Email</div>
                            <div className="col-3">Username</div>
                            <div className="col-4 actions">Actions</div>
                        </div>
                    </div>
                </div>
            </div>
            {data.map(el => {
                return (<div className="item" key={el.id}>
                    <Selector />

                    <div className="item-content">
                        <div className="item-body">
                            <div className="infos infos-col-4">
                                <div className="col-1">
                                    <div className="name">
                                        <span>{el.name}</span>
                                        <span className="role">{el.role}</span>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="sub">{el.email}</div>
                                </div>
                                <div className="col-3">
                                    <div className="sub">{el.username}</div>
                                </div>
                                <div className="col-4 actions">
                                    <ButtonIcon icon="pencil">Modifier</ButtonIcon>
                                    <ButtonIcon icon="trash">Supprimer</ButtonIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
            })}
        </div>
    </div>)
}

function TableCol5 ({ data }) {
    return (<div className="items-table">
        <div className="items items-default">
            <div className="item item-header">
                <div className="item-header-selector" />
                <div className="item-content">
                    <div className="item-body">
                        <div className="infos infos-col-5">
                            <div className="col-1">Nom</div>
                            <div className="col-2">Email</div>
                            <div className="col-3">Username</div>
                            <div className="col-4">S'est connecté</div>
                            <div className="col-5 actions">Actions</div>
                        </div>
                    </div>
                </div>
            </div>
            {data.map(el => {
                return (<div className="item" key={el.id}>
                    <Selector />

                    <div className="item-content">
                        <div className="item-body">
                            <div className="infos infos-col-5">
                                <div className="col-1">
                                    <div className="name">
                                        <span>{el.name}</span>
                                        <span className="role">{el.role}</span>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="sub">{el.email}</div>
                                </div>
                                <div className="col-3">
                                    <div className="sub">{el.username}</div>
                                </div>
                                <div className="col-4">
                                    <div className="sub">{el.when}</div>
                                </div>
                                <div className="col-5 actions">
                                    <ButtonIcon icon="pencil">Modifier</ButtonIcon>
                                    <ButtonIcon icon="trash">Supprimer</ButtonIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
            })}
        </div>
    </div>)
}

function TableCol2Image ({ data }) {
    return (<div className="items-table">
        <div className="items items-default">
            <div className="item item-header">
                <div className="item-header-selector" />
                <div className="item-content">
                    <div className="item-body item-body-image">
                        <div className="infos infos-col-2">
                            <div className="col-1">Nom</div>
                            <div className="col-2 actions">Actions</div>
                        </div>
                    </div>
                </div>
            </div>
            {data.map(el => {
                return (<div className="item" key={el.id}>
                    <Selector />

                    <div className="item-content">
                        <div className="item-body item-body-image">
                            <div className="item-image">
                                <img src={`https://robohash.org/${Math.random()}?size=64x64`} alt="Avatar" />
                            </div>
                            <div className="infos infos-col-2">
                                <div className="col-1">
                                    <div className="name">
                                        <span>{el.name}</span>
                                        <span className="role">{el.role}</span>
                                    </div>
                                </div>
                                <div className="col-2 actions">
                                    <ButtonIcon icon="pencil">Modifier</ButtonIcon>
                                    <ButtonIcon icon="trash">Supprimer</ButtonIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
            })}
        </div>
    </div>)
}

function TableCol3Image ({ data }) {
    return (<div className="items-table">
        <div className="items items-default">
            <div className="item item-header">
                <div className="item-header-selector" />
                <div className="item-content">
                    <div className="item-body item-body-image">
                        <div className="infos infos-col-3">
                            <div className="col-1">Nom</div>
                            <div className="col-2">Email</div>
                            <div className="col-3 actions">Actions</div>
                        </div>
                    </div>
                </div>
            </div>
            {data.map(el => {
                return (<div className="item" key={el.id}>
                    <Selector />

                    <div className="item-content">
                        <div className="item-body item-body-image">
                            <div className="item-image">
                                <img src={`https://robohash.org/${Math.random()}?size=64x64`} alt="Avatar" />
                            </div>
                            <div className="infos infos-col-3">
                                <div className="col-1">
                                    <div className="name">
                                        <span>{el.name}</span>
                                        <span className="role">{el.role}</span>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="sub">{el.email}</div>
                                </div>
                                <div className="col-3 actions">
                                    <ButtonIcon icon="pencil">Modifier</ButtonIcon>
                                    <ButtonIcon icon="trash">Supprimer</ButtonIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
            })}
        </div>
    </div>)
}

function TableCol4Image ({ data }) {
    return (<div className="items-table">
        <div className="items items-default">
            <div className="item item-header">
                <div className="item-header-selector" />
                <div className="item-content">
                    <div className="item-body item-body-image">
                        <div className="infos infos-col-4">
                            <div className="col-1">Nom</div>
                            <div className="col-2">Email</div>
                            <div className="col-3">Username</div>
                            <div className="col-4 actions">Actions</div>
                        </div>
                    </div>
                </div>
            </div>
            {data.map(el => {
                return (<div className="item" key={el.id}>
                    <Selector />

                    <div className="item-content">
                        <div className="item-body item-body-image">
                            <div className="item-image">
                                <img src={`https://robohash.org/${Math.random()}?size=64x64`} alt="Avatar" />
                            </div>
                            <div className="infos infos-col-4">
                                <div className="col-1">
                                    <div className="name">
                                        <span>{el.name}</span>
                                        <span className="role">{el.role}</span>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="sub">{el.email}</div>
                                </div>
                                <div className="col-3">
                                    <div className="sub">{el.username}</div>
                                </div>
                                <div className="col-4 actions">
                                    <ButtonIcon icon="pencil">Modifier</ButtonIcon>
                                    <ButtonIcon icon="trash">Supprimer</ButtonIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
            })}
        </div>
    </div>)
}
