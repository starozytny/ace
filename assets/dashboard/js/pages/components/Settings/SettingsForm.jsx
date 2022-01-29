import React, { Component } from 'react';

import axios            from "axios";
import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button }       from "@dashboardComponents/Tools/Button";
import { Alert }        from "@dashboardComponents/Tools/Alert";
import { Input }        from "@dashboardComponents/Tools/Fields";
import { Drop }         from "@dashboardComponents/Tools/Drop";

import Formulaire       from "@dashboardComponents/functions/Formulaire";
import Validateur       from "@commonComponents/functions/validateur";

function getBase64(file, self) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        self.setState({logoMail: reader.result })
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

export class SettingsForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            success: false,
            websiteName: props.data ? props.data.websiteName : "",
            emailGlobal: props.data ? props.data.emailGlobal : "",
            emailContact: props.data ? props.data.emailContact : "",
            emailRgpd: props.data ? props.data.emailRgpd : "",
            logoMail: props.data ? props.data.logoMail : "",
        }

        this.inputLogoMail = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleGetFile  = this.handleGetFile .bind(this);
        this.handleRemoveFile  = this.handleRemoveFile .bind(this);
        this.handleSubmit   = this.handleSubmit  .bind(this);
    }

    handleChange = (e) => { this.setState({[ e.currentTarget.name]: e.currentTarget.value})  }
    handleGetFile = (e) => { getBase64(e.file, this) }
    handleRemoveFile = (e) => { this.setState({ logoMail: this.props.data ? this.props.data.logoMail : "" }) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { websiteName, emailGlobal, emailContact, emailRgpd, logoMail } = this.state;

        this.setState({ success: false})

        // validate global
        let validate = Validateur.validateur([
            {type: "text", id: 'websiteName', value: websiteName},
            {type: "email", id: 'emailGlobal', value: emailGlobal},
            {type: "email", id: 'emailContact', value: emailContact},
            {type: "email", id: 'emailRgpd', value: emailRgpd},
            {type: "text", id: 'logoMail', value: logoMail},
        ])

        // check validate success
        if(!validate.code){
            this.setState({ errors: validate.errors });
        }else{
            Formulaire.loader(true);
            let self = this;
            axios({ method: "POST", url: Routing.generate('api_settings_update'), data: self.state })
                .then(function (response) {
                    self.setState({ success: "Paramètres mis à jours", errors: [] });
                })
                .catch(function (error) {
                    console.log(error)
                    Formulaire.displayErrors(self, error);
                })
                .then(() => {
                    Formulaire.loader(false);
                })
            ;
        }
    }

    render () {
        const { errors, success, websiteName, emailGlobal, emailContact, emailRgpd, logoMail } = this.state;

        return <>
            <div className="form">
                <form onSubmit={this.handleSubmit}>

                    {success !== false && <Alert type="info">{success}</Alert>}

                    <div className="line line-2">
                        <Input valeur={websiteName} identifiant="websiteName" errors={errors} onChange={this.handleChange}>Nom du site</Input>
                        <Input valeur={emailGlobal} identifiant="emailGlobal" errors={errors} onChange={this.handleChange} type="email">E-mail expéditeur global</Input>
                    </div>

                    <div className="line line-2">
                        <Input valeur={emailContact} identifiant="emailContact" errors={errors} onChange={this.handleChange} type="email">E-mail expéditeur contact</Input>
                        <Input valeur={emailRgpd} identifiant="emailRgpd" errors={errors} onChange={this.handleChange} type="email">E-mail expéditeur RGPD</Input>
                    </div>

                    <div className="line">
                        <div className="form-files">
                            {logoMail === "" ? null : <div className="form-logo"><img src={logoMail} alt="logo actuel du site internet"/></div>}
                            <Drop ref={this.inputLogoMail} identifiant="logoMail" errors={errors} accept={"image/*"} maxFiles={1}
                                  label="Téléverser votre logo" labelError="Seules les images sont acceptées."
                                  onGetFile={this.handleGetFile} onRemoveFile={this.handleRemoveFile}>Logo</Drop>
                        </div>
                    </div>

                    <div className="line">
                        <div className="form-button">
                            <Button isSubmit={true}>Mettre à jour</Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    }
}