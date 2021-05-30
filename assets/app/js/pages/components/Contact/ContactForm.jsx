import React, { Component } from "react";

import axios                from "axios";
import toastr               from "toastr";
import Routing              from "@publicFolder/bundles/fosjsrouting/js/router.min";

import { Input, TextArea }  from "@dashboardComponents/Tools/Fields";
import { Button }           from "@dashboardComponents/Tools/Button";
import { Alert }            from "@dashboardComponents/Tools/Alert";
import { RgpdInfo }         from "@appComponents/Tools/Rgpd";

import Validateur           from "@dashboardComponents/functions/validateur";
import Formulaire           from "@dashboardComponents/functions/Formulaire";

export class ContactForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            success: null,
            critere: "",
            name: "",
            email: "",
            message: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => { this.setState({ [e.currentTarget.name]: e.currentTarget.value }) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { critere, name, email, message } = this.state;

        if(critere !== ""){
            toastr.error("Veuillez rafraichir la page.");
        }else{
            let validate = Validateur.validateur([
                {type: "text", id: 'name', value: name},
                {type: "text", id: 'email', value: email},
                {type: "text", id: 'message', value: message},
            ])

            if(!validate.code) {
                this.setState({errors: validate.errors});
                toastr.error("Veuillez vérifier que tous les champs obligatoires soient renseignés")
            }else{
                Formulaire.loader(true);
                let self = this;
                axios.post(Routing.generate('api_contact_create'), self.state)
                    .then(function (response) {
                        let data = response.data;
                        self.setState({
                            name: "",
                            email: "",
                            message: "",
                            errors: [],
                            success: data.message
                        })
                    })
                    .catch(function (error) {
                        Formulaire.displayErrors(self, error);
                    })
                    .then(() => {
                        Formulaire.loader(false);
                    })
                ;
            }
        }
    }

    render () {
        const { errors, success, critere, name, email, message } = this.state;

        return <form onSubmit={this.handleSubmit}>
            {success && <Alert type="info">{success}</Alert>}
            <div className="line line-2">
                <Input identifiant="name" valeur={name} errors={errors} onChange={this.handleChange}>Nom / Raison sociale</Input>
                <Input identifiant="email" valeur={email} errors={errors} onChange={this.handleChange} type="email">Adresse e-mail</Input>
            </div>
            <div className="line line-critere">
                <Input identifiant="critere" valeur={critere} errors={errors} onChange={this.handleChange}>Critère</Input>
            </div>
            <div className="line">
                <TextArea identifiant="message" valeur={message} errors={errors} onChange={this.handleChange}>Message</TextArea>
            </div>
            <div className="line">
                <RgpdInfo utility="la gestion des demandes de contacts"/>
            </div>
            <div className="line">
                <Button isSubmit={true}>Envoyer le message</Button>
            </div>
        </form>
    }
}