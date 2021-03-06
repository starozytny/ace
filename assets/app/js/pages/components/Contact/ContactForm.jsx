import React, { Component } from "react";

import axios                from "axios";
import toastr               from "toastr";
import Routing              from "@publicFolder/bundles/fosjsrouting/js/router.min";

import { Input, Select, TextArea } from "@dashboardComponents/Tools/Fields";
import { Button }           from "@dashboardComponents/Tools/Button";
import { Alert }            from "@dashboardComponents/Tools/Alert";
import { RgpdInfo }         from "@appComponents/Tools/Rgpd";

import Validateur           from "@commonComponents/functions/validateur";
import Formulaire           from "@dashboardComponents/functions/Formulaire";

function getAteliers(self, ateliers, name=null, value=null)
{
    if(ateliers.length === 0){
        Formulaire.loader(true);
        axios.get(Routing.generate('api_ateliers_index'))
            .then(function (response) {
                let data = response.data;
                if(name !== null){
                    self.setState({ [name]: value, ateliers: data })
                }else{
                    self.setState({ ateliers: data })
                }
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

export class ContactForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            success: null,
            critere: "",
            name: "",
            email: "",
            phone: "",
            subject: props.subject,
            atelier: props.atelier ? parseInt(props.atelier) : "",
            message: "",
            ateliers: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = () => {
        const { subject, ateliers } = this.state;

        if(subject === "ateliers"){
            getAteliers(this, ateliers);
        }
    }

    handleChange = (e) => {
        const { ateliers } = this.state;

        let name = e.currentTarget.name;
        let value = e.currentTarget.value

        if(name === "subject" && value === "ateliers"){
            getAteliers(this, ateliers, name, value);
        }else{
            this.setState({ [name]: value })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { critere, name, email, message, subject, atelier } = this.state;

        if(critere !== ""){
            toastr.error("Veuillez rafraichir la page.");
        }else{
            let paramsToValidate = [
                {type: "text", id: 'name', value: name},
                {type: "text", id: 'email', value: email},
                {type: "text", id: 'message', value: message},
                {type: "text", id: 'subject', value: subject},
            ]

            if(subject === "ateliers"){
                paramsToValidate = [...paramsToValidate,
                    ...[{type: "text", id: 'atelier', value: atelier}]
                ];
            }

            let validate = Validateur.validateur(paramsToValidate)
            if(!validate.code) {
                this.setState({errors: validate.errors});
                toastr.error("Veuillez v??rifier que tous les champs obligatoires soient renseign??s")
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
                            atelier: "",
                            phone: "",
                            errors: [],
                            success: data.message
                        })
                    })
                    .catch(function (error) {
                        console.log(error)
                        console.log(error.response)
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
        const { errors, success, critere, name, email, message, phone, subject, ateliers, atelier } = this.state;

        let selectItems = [
            { value: "etudiants-lyceens", label: 'Etudiants/Lyc??ens', identifiant: 'etudiants' },
            { value: "entreprises", label: 'Entreprises', identifiant: 'entreprises' },
            { value: "particuliers", label: 'Particuliers', identifiant: 'particuliers' },
            { value: 'sportifs', label: 'Sportifs', identifiant: 'sportifs' },
            { value: 'ateliers', label: 'Ateliers', identifiant: 'ateliers' },
            { value: 'autre', label: 'Autre demande', identifiant: 'autre' },
        ]

        let selectItemsAteliers = ateliers.map(el => {
            return { value: el.id, label: el.name, identifiant: "atelier-" + el.id };
        })

        return <form onSubmit={this.handleSubmit}>
            {success && <Alert type="info">{success}</Alert>}
            <div className="line line-2">
                <Input identifiant="name" valeur={name} errors={errors} onChange={this.handleChange}>Nom / Raison sociale</Input>
                <Input identifiant="email" valeur={email} errors={errors} onChange={this.handleChange} type="email">Adresse e-mail</Input>
            </div>
            <div className="line line-2">
                <Input identifiant="phone" valeur={phone} errors={errors} onChange={this.handleChange} type="number">T??l??phone (facultatif)</Input>
                <Select items={selectItems} identifiant="subject" valeur={subject} errors={errors} onChange={this.handleChange}>Sujet de votre demande ?</Select>
            </div>
            {subject === "ateliers" && <div className="line">
                <Select items={selectItemsAteliers} identifiant="atelier" valeur={atelier} errors={errors} onChange={this.handleChange}>De quel atelier s'agit-il ?</Select>
            </div>}
            <div className="line line-critere">
                <Input identifiant="critere" valeur={critere} errors={errors} onChange={this.handleChange}>Crit??re</Input>
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