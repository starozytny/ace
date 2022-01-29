import React, { Component } from 'react';

import axios            from "axios";
import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Aside }        from "@dashboardComponents/Tools/Aside";
import { Input }        from "@dashboardComponents/Tools/Fields";
import { Button }       from "@dashboardComponents/Tools/Button";
import { Alert }        from "@dashboardComponents/Tools/Alert";
import Validateur       from "@commonComponents/functions/validateur";
import Formulaire       from "@dashboardComponents/functions/Formulaire";

export class Forget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fUsername: "",
            errors: [],
            success: false
        }

        this.aside = React.createRef();

        this.handleOpen = this.handleOpen.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleOpen = () => { this.aside.current.handleOpen("Mot de passe oublié ?"); }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}); }

    handleSubmit = (e) => {
        e.preventDefault();

        const { fUsername } = this.state;

        this.setState({ success: false})

        // validate global
        let validate = Validateur.validateur([{type: "text", id: 'fUsername', value: fUsername}])

        // check validate success
        if(!validate.code){
            this.setState({ errors: validate.errors });
        }else{
            Formulaire.loader(true);
            let self = this;
            axios({ method: "POST", url: Routing.generate("api_users_password_forget"), data: self.state })
                .then(function (response) {
                    self.setState({ success: response.data.message, errors: [] });
                    self.setState( { fUsername: '' });
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

    render () {
        const { errors, success, fUsername } = this.state;

        let aside = <div className="form">
            <p className="form-infos">
                Une fois la demande réalisée, un mail est envoyé à l'adresse associé au compte.
                Ce mail contient un lien vous permettant de réinitialiser votre mot de passe. <br/> <br/>
                Pensez à vérifier vos spams/courriers indésirables.
            </p>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <Input valeur={fUsername} identifiant="fUsername" errors={errors} onChange={this.handleChange}>Nom utilisateur</Input>
                </div>
                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>Envoyer le lien</Button>
                    </div>
                </div>
            </form>
        </div>

        return <>
            <span className="btn-forget" onClick={this.handleOpen}>Mot de passe oublié ?</span>
            <Aside ref={this.aside} content={aside}/>
        </>
    }
}