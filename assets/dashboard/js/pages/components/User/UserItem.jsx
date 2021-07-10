import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";

export class UserItem extends Component {
    render () {
        const { elem, onChangeContext, onDelete, onSelectors } = this.props

        let url = Routing.generate('user_homepage', {'_switch_user' : elem.username})

        if(elem.highRoleCode === 2){
            url = Routing.generate('admin_homepage', {'_switch_user' : elem.username})
        }

        let avatar = `https://robohash.org/${elem.username}?size=64x64`;
        if(elem.avatar){
            avatar = "/avatars/" + elem.avatar;
        }

        return <div className="item">
            <Selector id={elem.id} onSelectors={onSelectors} />

            <div className="item-content">
                <div className="item-body item-body-image">
                    <div className="item-image" onClick={() => onChangeContext('read', elem)}>
                        <img src={avatar} alt={`Avatar de ${elem.username}`}/>
                    </div>
                    <div className="infos infos-col-3">
                        <div className="col-1">
                            <div className="name">
                                <span>{elem.lastname.toUpperCase()} {elem.firstname}</span>
                                {elem.highRoleCode !== 0 && <span className="role">{elem.highRole}</span>}
                            </div>
                            {elem.lastLoginAgo && <div className="sub">Connecté {elem.lastLoginAgo}</div>}
                        </div>
                        <div className="col-2">
                            <div className="sub sub-username">{elem.username}</div>
                            {elem.email !== "undefined@undefined.fr" ? <div className="sub">{elem.email}</div> : <div className="sub txt-danger"><span className="icon-warning" /> {elem.email}</div>}
                        </div>
                        <div className="col-3 actions">
                            {elem.highRoleCode !== 1 &&
                            <>
                                <ButtonIcon icon="vision" onClick={() => onChangeContext("read", elem)}>Profil</ButtonIcon>
                                <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                                <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                                <ButtonIcon icon="share" element="a" target="_blank" onClick={url}>Imiter</ButtonIcon>
                            </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}