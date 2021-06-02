import React, { Component } from 'react';

import axios                   from "axios";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Checkbox }     from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";

import Validateur              from "@dashboardComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

export function UserFormulaire ({ type, onChangeContext, onUpdateList, element })
{
    let title = "Ajouter un utilisateur";
    let url = Routing.generate('api_users_create');
    let msg = "Félicitation ! Vous avez ajouté un nouveau utilisateur !"

    if(type === "update"){
        title = "Modifier " + element.username;
        url = Routing.generate('api_users_update', {'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisé avec succès !";
    }

    let form = <UserForm
        context={type}
        url={url}
        username={element ? element.username : ""}
        firstname={element ? element.firstname : ""}
        lastname={element ? element.lastname : ""}
        email={element ? element.email : ""}
        roles={element ? element.roles : []}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class UserForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: props.username,
            firstname: props.firstname,
            lastname: props.lastname,
            email: props.email,
            roles: props.roles,
            password: '',
            passwordConfirm: '',
            errors: [],
            success: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        document.getElementById("username").focus()
    }

    handleChange = (e) => {
        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        const {roles} = this.state
        if(name === "roles"){
            value = (e.currentTarget.checked) ? [...roles, ...[value]] :  roles.filter(v => v !== value)
        }

        this.setState({[name]: value})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { username, firstname, lastname, password, passwordConfirm, email, roles } = this.state;

        this.setState({ success: false})

        let method = "PUT";
        let paramsToValidate = [
            {type: "text", id: 'username', value: username},
            {type: "text", id: 'firstname', value: firstname},
            {type: "text", id: 'lastname', value: lastname},
            {type: "email", id: 'email', value: email},
            {type: "array", id: 'roles', value: roles}
        ];
        if(context === "create"){
            method = "POST";
            if(password !== ""){
                paramsToValidate = [...paramsToValidate,
                    ...[{type: "password", id: 'password', value: password, idCheck: 'passwordConfirm', valueCheck: passwordConfirm}]
                ];
            }
        }

        // validate global
        let validate = Validateur.validateur(paramsToValidate)

        // check validate success
        if(!validate.code){
            this.setState({ errors: validate.errors });
        }else{
            Formulaire.loader(true);
            let self = this;
            axios({ method: method, url: url, data: self.state })
                .then(function (response) {
                    let data = response.data;
                    self.props.onUpdateList(data);
                    self.setState({ success: messageSuccess, errors: [] });
                    if(context === "create"){
                        self.setState( {
                            username: '',
                            firstname: '',
                            lastname: '',
                            email: '',
                            roles: [],
                            password: '',
                            passwordConfirm: '',
                        })
                    }
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

    render () {
        const { context } = this.props;
        const { errors, success, username, firstname, lastname, email, password, passwordConfirm, roles } = this.state;

        let rolesItems = [
            { 'value': 'ROLE_ADMIN', 'label': 'Admin', 'identifiant': 'admin' },
            { 'value': 'ROLE_USER', 'label': 'Utilisateur', 'identifiant': 'utilisateur' },
        ]

        return <>
            <p className="form-infos">
                Le nom d'utilisateur est automatiquement formaté, les espaces et les accents sont supprimés ou remplacés.
            </p>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-2">
                    <Input valeur={username} identifiant="username" errors={errors} onChange={this.handleChange} >Nom utilisateur</Input>
                    <Input valeur={email} identifiant="email" errors={errors} onChange={this.handleChange} type="email" >Adresse e-mail</Input>
                </div>

                <div className="line line-2">
                    <Input valeur={firstname} identifiant="firstname" errors={errors} onChange={this.handleChange} >Prénom</Input>
                    <Input valeur={lastname} identifiant="lastname" errors={errors} onChange={this.handleChange} >Nom</Input>
                </div>

                <div className="line line-2">
                    <Checkbox items={rolesItems} identifiant="roles" valeur={roles} errors={errors} onChange={this.handleChange}>Roles</Checkbox>

                    {context === "create" && <div className="password-rules">
                        <p>Règles de création de mot de passe :</p>
                        <ul>
                            <li>Au moins 12 caractères</li>
                            <li>Au moins 1 minuscule</li>
                            <li>Au moins 1 majuscule</li>
                            <li>Au moins 1 chiffre</li>
                            <li>Au moins 1 caractère spécial</li>
                        </ul>
                    </div>}
                </div>

                {context === "create" ? <>
                    <Alert type="reverse">
                        Laisser le champs vide génére un mot de passe aléatoire. L'utilisateur pourra utilise la
                        fonction <u>Mot de passe oublié ?</u> pour créer son mot de passe.
                    </Alert>
                    <div className="line line-2">
                        <Input type="password" valeur={password} identifiant="password" errors={errors} onChange={this.handleChange} >Mot de passe (facultatif)</Input>
                        <Input type="password" valeur={passwordConfirm} identifiant="passwordConfirm" errors={errors} onChange={this.handleChange} >Confirmer le mot de passe</Input>
                    </div>
                </> : <Alert type="warning">Le mot de passe est modifiable exclusivement par l'utilisateur lui même grâce à la fonction <u>Mot de passe oublié ?</u></Alert>}

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? "Ajouter l'utilisateur" : 'Modifier l\'utilisateur'}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}