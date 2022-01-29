import React, { Component } from 'react';

import axios                   from "axios";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Checkbox }     from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { Drop }                from "@dashboardComponents/Tools/Drop";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_users_create";
const URL_UPDATE_GROUP       = "api_users_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

export function UserFormulaire ({ type, onChangeContext, onUpdateList, element })
{
    let title = "Ajouter un utilisateur";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitations ! Vous avez ajouté un nouveau utilisateur !"

    if(type === "update" || type === "profil"){
        title = "Modifier " + element.username;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitations ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <Form
        context={type}
        url={url}
        username={element ? element.username : ""}
        firstname={element ? element.firstname : ""}
        lastname={element ? element.lastname : ""}
        email={element ? element.email : ""}
        avatar={element ? element.avatar : null}
        roles={element ? element.roles : []}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: props.username,
            firstname: props.firstname,
            lastname: props.lastname,
            email: props.email,
            roles: props.roles,
            avatar: props.avatar,
            password: '',
            passwordConfirm: '',
            errors: [],
            success: false
        }

        this.inputAvatar = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        Helper.toTop();
        let username = document.getElementById("username");
        if(username){ username.focus(); }
    }

    handleChange = (e) => {
        const { roles } = this.state

        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        if(name === "roles"){
            value = Formulaire.updateValueCheckbox(e, roles, value);
        }

        this.setState({[name]: value})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { username, firstname, lastname, password, passwordConfirm, email, roles } = this.state;

        this.setState({ success: false})

        let paramsToValidate = [
            {type: "text", id: 'username',  value: username},
            {type: "text", id: 'firstname', value: firstname},
            {type: "text", id: 'lastname',  value: lastname},
            {type: "email", id: 'email',    value: email},
            {type: "array", id: 'roles',    value: roles}
        ];
        if(context === "create" || context === "profil"){
            if(password !== ""){
                paramsToValidate = [...paramsToValidate,
                    ...[{type: "password", id: 'password', value: password, idCheck: 'passwordConfirm', valueCheck: passwordConfirm}]
                ];
            }
        }

        let inputAvatar = this.inputAvatar.current;
        let avatar = inputAvatar ? inputAvatar.drop.current.files : [];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            Formulaire.loader(true);
            let self = this;

            let formData = new FormData();
            if(avatar[0]){
                formData.append('avatar', avatar[0].file);
            }

            formData.append("data", JSON.stringify(this.state));

            axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {
                    let data = response.data;
                    Helper.toTop();
                    if(self.props.onUpdateList){
                        self.props.onUpdateList(data);
                    }
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
        const { errors, success, username, firstname, lastname, email, password, passwordConfirm, roles, avatar } = this.state;

        let rolesItems = [
            { value: 'ROLE_ADMIN', label: 'Admin',          identifiant: 'admin' },
            { value: 'ROLE_USER',  label: 'Utilisateur',    identifiant: 'utilisateur' },
        ]

        return <>
            <p className="form-infos">
                Le nom d'utilisateur est automatiquement formaté, les espaces et les accents sont supprimés ou remplacés.
            </p>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className={"line" + (context !== "profil" ? " line-2" : "")}>
                    {context !== "profil" && <Input valeur={username} identifiant="username" errors={errors} onChange={this.handleChange}>Nom utilisateur</Input>}
                    <Input valeur={email} identifiant="email" errors={errors} onChange={this.handleChange} type="email" >Adresse e-mail</Input>
                </div>

                <div className="line line-2">
                    <Input valeur={firstname} identifiant="firstname" errors={errors} onChange={this.handleChange} >Prénom</Input>
                    <Input valeur={lastname} identifiant="lastname" errors={errors} onChange={this.handleChange} >Nom</Input>
                </div>

                {context !== "profil" && <div className="line line-2">
                    <Checkbox items={rolesItems} identifiant="roles" valeur={roles} errors={errors} onChange={this.handleChange}>Roles</Checkbox>

                    <Drop ref={this.inputAvatar} identifiant="avatar" file={avatar} folder="avatars" errors={errors} accept={"image/*"} maxFiles={1}
                          label="Téléverser un avatar" labelError="Seules les images sont acceptées.">Avatar (facultatif)</Drop>
                </div>}

                {(context === "create" || context === "profil") ? <>
                    <Alert type="reverse">
                        Laisser le champs vide génére un mot de passe aléatoire. L'utilisateur pourra utilise la
                        fonction <u>Mot de passe oublié ?</u> pour créer son mot de passe.
                    </Alert>
                    <div className="line">
                        <PasswordRules />
                    </div>
                    <div className="line line-2">
                        <Input type="password" valeur={password} identifiant="password" errors={errors} onChange={this.handleChange} >Mot de passe (facultatif)</Input>
                        <Input type="password" valeur={passwordConfirm} identifiant="passwordConfirm" errors={errors} onChange={this.handleChange} >Confirmer le mot de passe</Input>
                    </div>
                </> : <Alert type="warning">Le mot de passe est modifiable exclusivement par l'utilisateur lui même grâce à la fonction <u>Mot de passe oublié ?</u></Alert>}

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? TXT_CREATE_BUTTON_FORM : TXT_UPDATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}

export function PasswordRules() {
    return <div className="password-rules">
        <p>Règles de création de mot de passe :</p>
        <ul>
            <li>Au moins 12 caractères</li>
            <li>Au moins 1 minuscule</li>
            <li>Au moins 1 majuscule</li>
            <li>Au moins 1 chiffre</li>
            <li>Au moins 1 caractère spécial</li>
        </ul>
    </div>
}