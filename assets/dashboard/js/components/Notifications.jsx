import React, { Component } from "react";

import axios      from "axios";
import Routing    from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@dashboardComponents/functions/Formulaire";
import Sort       from "@dashboardComponents/functions/sort";

export class Notifications extends Component{
    constructor(props) {
        super();

        this.state = {
            open: false,
            data: null
        }

        this.wrapperRef = React.createRef();

        this.handleOpen = this.handleOpen.bind(this);
        this.handleSeen = this.handleSeen.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount = () => { Formulaire.axiosGetData(this, Routing.generate('api_notifications_index'), Sort.compareCreatedAt) }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.setState({ open: !this.state.open })
        }
    }

    handleUpdateList = (element, newContext = null) => {
        const { data } = this.state
        Formulaire.updateData(this, Sort.compareCreatedAt, newContext, "update", data, element);
    }

    handleOpen = () => {
        if(this.state.open){
            document.removeEventListener('mousedown', this.handleClickOutside);
        }else{
            document.addEventListener('mousedown', this.handleClickOutside);
        }
        this.setState({ open: !this.state.open })
    }

    handleSeen = (element) => {
        if(!element.isSeen){
            const self = this;
            axios.post(Routing.generate('api_notifications_isSeen', {'id': element.id}), {})
                .then(function (response) {
                    let data = response.data;
                    self.handleUpdateList(data, 'update');
                })
                .catch(function (error) {
                    Formulaire.displayErrors(self, error)
                })
            ;
        }
    }

    handleDelete = (element) => {
        Formulaire.deleteElement(this, element, Routing.generate('api_notifications_delete', {'id': element.id}), false, false);
    }

    render() {
        const { open, data } = this.state;

        let taille = data && data.length;

        return <div ref={this.wrapperRef} className={"notif-container" + (open ? " active" : "")}>
            <div className="btn-notif" onClick={this.handleOpen}>
                <span className="icon-notification" />
                {taille !== 0 && <span className="number">{taille}</span>}
            </div>
            <div className="notif-card">
                <div className="notif-cancel">
                    <span>Notifications</span>
                    <span className="icon-cancel" onClick={this.handleOpen} />
                </div>
                <div className="notif-body">
                    {data && data.length !== 0 ? data.map(el => {
                        return <div className="item" key={el.id}>
                            <div className="item-content" onClick={() => this.handleSeen(el)}>
                                <div className="item-icon">
                                    <span className={"icon-" + el.icon} />
                                </div>
                                <div className="item-infos">
                                    <div className="title">{!el.isSeen && <span className="toSee" />} {el.name}</div>
                                    <div className="createdAt">{el.createdAtAgo}</div>
                                </div>
                            </div>
                            <div className="item-actions">
                                <span className="icon-trash" onClick={() => this.handleDelete(el)}/>
                            </div>
                        </div>
                    }) : <div className="item"><div className="createdAt">Aucune notification</div></div>}
                </div>
                <div className="notif-all">
                    Voir toutes les notifications
                </div>
            </div>
        </div>
    }
}