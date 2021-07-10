import React, { Component } from 'react';

import {Button, ButtonIcon} from "@dashboardComponents/Tools/Button";

export class UserRead extends Component {
    render () {
        const { elem, onChangeContext } = this.props;

        let avatar = `https://robohash.org/${elem.username}?size=64x64`;
        if(elem.avatar){
            avatar = "/avatars/" + elem.avatar;
        }

        return <>
            <div>
                <div className="toolbar">
                    <div className="item">
                        <Button outline={true} icon="left-arrow" type="primary" onClick={() => onChangeContext("list")}>Retour à la liste</Button>
                    </div>
                </div>

                <div className="item-user-read">

                    <div className="user-read-infos">
                        <div className="actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext('update', elem)} >Modifier</ButtonIcon>
                        </div>
                        <div className="user-read-infos-container">
                            <div className="avatar">
                                <img src={avatar} alt={`Avatar de ${elem.username}`}/>
                            </div>

                            <div className="main-infos">
                                <div className="name">
                                    <div>#{elem.id}</div>
                                    <span>{elem.lastname.toUpperCase()} {elem.firstname}</span>
                                </div>
                                <div className="username">
                                    <span>({elem.username})</span>
                                </div>
                                <div className="sub">{elem.email}</div>
                            </div>

                            <div className="footer-infos">
                                <div className="role role-time">Membre depuis le {elem.createdAtString}</div>
                                <div className="role">{elem.highRole}</div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    }
}