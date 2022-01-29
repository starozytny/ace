import React, { Component } from "react";

import axios       from "axios";
import toastr      from "toastr";
import Routing     from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { DatePick, DateTimePick, TimePick }            from "@dashboardComponents/Tools/DatePicker";
import { Drop }                                        from "@dashboardComponents/Tools/Drop"
import { Button }                                      from "@dashboardComponents/Tools/Button";
import { Trumb }                                       from "@dashboardComponents/Tools/Trumb";
import {
    Checkbox, Input, Radiobox, Select, TextArea,
    SelectReactSelectize, SelectizeMultiple
} from "@dashboardComponents/Tools/Fields";

import Validator    from "@commonComponents/functions/validateur";
import Helper       from "@commonComponents/functions/helper";
import Formulaire   from "@dashboardComponents/functions/Formulaire";

export class StyleguideForm extends Component {
    constructor(props) {
        super();

        this.state = {
            errors: [],
            username: "",
            email: "",
            message: "",
            roles: [], // default : ["ROLE_USER"]
            sexe: "",  // default : 0
            pays: "",  // default : "France"
            birthday: "", // from component : new Date(getCreatedAtJavascript)
            createAt: "",
            arrived: "",
            postalCode: "",
            arrayPostalCode: [],
            city: "",
            fruit: "",
            faq: { value: "", html: "" }, // faq: { value: props.faq ? props.faq : "", html: props.faq ? props.faq : "" },
            question: [],
            users: []
        }

        // In ENTITY
        //
        // public function getCreatedAtJavascript(): ?string
        // {
        //     date_default_timezone_set('Europe/Paris');
        //     return $this->getCreatedAt() != null ? date_format($this->getCreatedAt(), 'F d, Y H:i:s') : null;
        // }

        this.inputAvatar = React.createRef();
        this.inputFiles = React.createRef();
        this.selectMultiple = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.handleChangePostalCodeCity = this.handleChangePostalCodeCity.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChangeTrumb = this.handleChangeTrumb.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = () => { Helper.getPostalCodes(this); } // fill arrayPostalCode

    handleChange = (e) => {
        const { roles } = this.state;

        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        if(name === "roles"){
            value = Formulaire.updateValueCheckbox(e, roles, value);
        }

        if(name === "question"){
            value = (e.currentTarget.checked) ? [parseInt(value)] : [] // parseInt because work with int this time
        }

        this.setState({ [name]: value })
    }

    handleChangeFile = (e) => {
        let files = e.target.files;
        let self = this;
        if(files){
            Array.prototype.forEach.call(files, (file) => {
                if (/\.(jpe?g|png|gif)$/i.test(file.name)){
                    //getBase64(file, self, rank);
                }
            })
        }
    }

    handleChangeSelect = (name, e) => { this.setState({ [name]: e !== undefined ? e.value : "" }) }

    handleChangeSelectMultipleAdd = (name, valeurs) => {
        this.setState({ [name]: valeurs })
        this.selectMultiple.current.handleUpdateValeurs(valeurs);
    }

    handleChangeSelectMultipleDel = (name, valeur) => {
        let valeurs = this.state.users.filter(v => v.value !== valeur.value);
        this.setState({ [name]: valeurs });
        this.selectMultiple.current.handleUpdateValeurs(valeurs);
    }

    handleChangePostalCodeCity = (e) => {
        const { arrayPostalCode } = this.state;

        Helper.setCityFromZipcode(this, e, arrayPostalCode)
    }

    handleChangeDate = (name, e) => { this.setState({ [name]: e !== null ? e : "" }) }

    handleChangeTrumb = (e) => {
        let name = e.currentTarget.id;
        let text = e.currentTarget.innerHTML;

        this.setState({[name]: {value: [name].value, html: text}})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { username, email, message, roles, sexe, pays, birthday,
            createAt, arrived, postalCode, city, fruit, faq, question } = this.state;

        let avatar = this.inputAvatar.current.drop.current.files;
        let files = this.inputFiles.current.drop.current.files;

        let validate = Validator.validateur([
            {type: "text",  id: 'username',     value: username},
            {type: "email", id: 'email',        value: email},
            {type: "text",  id: 'message',      value: message},
            {type: "array", id: 'roles',        value: roles},
            {type: "text",  id: 'sexe',         value: sexe},
            {type: "text",  id: 'pays',         value: pays},
            {type: "text",  id: 'birthday',     value: birthday},
            {type: "text",  id: 'createAt',     value: createAt},
            {type: "text",  id: 'arrived',      value: arrived},
            {type: "text",  id: 'postalCode',   value: postalCode},
            {type: "text",  id: 'city',         value: city},
            {type: "array", id: 'avatar',       value: avatar},
            {type: "array", id: 'files',        value: files},
            {type: "text",  id: 'fruit',        value: fruit},
            {type: "text",  id: 'faq',          value: faq.html},
            {type: "text",  id: 'question',     value: question},
        ])

        toastr.error("Bonjour, je suis un <b>message d'erreur</b>, je suis un peu long pour tester la taille de la boite de dialogue.")
        toastr.info("Info. 🧐")
        toastr.warning("Warning. 😱")
        toastr.success("Success ! 😁")

        console.log(question)

        if(avatar !== ""){
            let formData = new FormData();
            if(avatar[0]){
                formData.append('avatar', avatar[0].file);
            }

            const self = this;
            Formulaire.loader(true);
            axios.post(Routing.generate('api_settings_test_upload'), formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(function (response) {
                    let data = response.data;
                    console.log(data)
                })
                .catch(function (error) {
                    Formulaire.displayErrors(self, error);
                })
                .then(function () {
                    Formulaire.loader(false);
                })
            ;
        }

        if(!validate.code){
            this.setState({ errors: validate.errors });
        }else{
            this.setState({ errors: []});
        }
    }

    render () {
        const { errors, username, email, message, roles, sexe, pays, birthday,
            createAt, arrived, postalCode, city, fruit, faq, question, users } = this.state;

        let checkboxItems = [
            { value: 'ROLE_USER', label: 'Utilisateur', identifiant: 'utilisateur' },
            { value: 'ROLE_ADMIN', label: 'Admin', identifiant: 'admin' }
        ]

        let radioboxItems = [
            { value: 0, label: 'Homme', identifiant: 'homme' },
            { value: 1, label: 'Femme', identifiant: 'femme' }
        ]

        let selectItems = [
            { value: 0, label: 'France', identifiant: 'france' },
            { value: 1, label: 'Allemagne', identifiant: 'allemagne' },
            { value: 2, label: 'Japon', identifiant: 'japon' },
        ]

        let selectFruitItems = [
            { value: 0, label: 'Orange', identifiant: 'orange' },
            { value: 1, label: 'Pomme', identifiant: 'pomme' },
            { value: 2, label: 'Mangue', identifiant: 'mangue' },
        ]

        let selectUsers = [
            { value: 0, label: 'Orange', identifiant: 'orange' },
            { value: 1, label: 'Pomme', identifiant: 'pomme' },
            { value: 2, label: 'Mangue', identifiant: 'mangue' },
        ]

        let switcherItems = [ { value: 0, label: 'Non', identifiant: 'non' } ]

        let includeTimesMorning = Helper.setIncludeTimes(6, 12, 0, 55);

        return (
            <>
                <section className="form">
                    <h2>Formulaire Line</h2>
                    <div className="form-items">
                        <form>
                            <div className="line">
                                <Input identifiant="username" valeur={username} errors={errors} onChange={this.handleChange}>Line 1 - Col 1</Input>
                            </div>

                            <div className="line line-2">
                                <Input identifiant="username" valeur={username} errors={errors} onChange={this.handleChange}>Line 2 - Col 1</Input>
                                <Input identifiant="username" valeur={username} errors={errors} onChange={this.handleChange}>Line 2 - Col 2</Input>
                            </div>

                            <div className="line line-3">
                                <Input identifiant="username" valeur={username} errors={errors} onChange={this.handleChange}>Line 3 - Col 1</Input>
                                <Input identifiant="username" valeur={username} errors={errors} onChange={this.handleChange}>Line 3 - Col 2</Input>
                                <Input identifiant="username" valeur={username} errors={errors} onChange={this.handleChange}>Line 3 - Col 3</Input>
                            </div>
                            <div className="line line-4">
                                <Input identifiant="username" valeur={username} errors={errors} onChange={this.handleChange}>Line 4 - Col 1</Input>
                                <Input identifiant="username" valeur={username} errors={errors} onChange={this.handleChange}>Line 4 - Col 2</Input>
                                <Input identifiant="username" valeur={username} errors={errors} onChange={this.handleChange}>Line 4 - Col 3</Input>
                                <Input identifiant="username" valeur={username} errors={errors} onChange={this.handleChange}>Line 4 - Col 4</Input>
                            </div>
                        </form>
                    </div>
                </section>
                <section className="form">
                    <h2>Formulaire</h2>
                    <div className="form-items">
                        <form onSubmit={this.handleSubmit}>
                            <div className="line line-2">
                                <Input identifiant="username" valeur={username} errors={errors} onChange={this.handleChange}>Username</Input>
                                <Input identifiant="email" valeur={email} errors={errors} onChange={this.handleChange} type="email">Adresse e-mail</Input>
                            </div>

                            <div className="line">
                                <TextArea identifiant="message" valeur={message} errors={errors} onChange={this.handleChange}>Message</TextArea>
                            </div>

                            <div className="line">
                                <Trumb identifiant="faq" valeur={faq.value} errors={errors} onChange={this.handleChangeTrumb}>F.A.Q</Trumb>
                            </div>

                            <div className="line line-2">
                                <Checkbox items={checkboxItems} identifiant="roles" valeur={roles} errors={errors} onChange={this.handleChange}>Roles</Checkbox>
                                <Radiobox items={radioboxItems} identifiant="sexe" valeur={sexe} errors={errors} onChange={this.handleChange}>Sexe</Radiobox>
                            </div>

                            <div className="line">
                                <Select items={selectItems} identifiant="pays" valeur={pays} errors={errors} onChange={this.handleChange}>De quel pays viens-tu ?</Select>
                            </div>

                            <div className="line">
                                <SelectReactSelectize items={selectFruitItems} identifiant="fruit" placeholder={"Sélectionner votre fruit"}
                                                      valeur={fruit} errors={errors} onChange={(e) => this.handleChangeSelect('fruit', e)}>
                                    Votre fruit préféré ?
                                </SelectReactSelectize>
                            </div>

                            <div className="line line-3">
                                <DatePick identifiant="birthday" valeur={birthday} errors={errors} onChange={(e) => this.handleChangeDate("birthday", e)}>Date de naissance</DatePick>
                                <DateTimePick identifiant="createAt" valeur={createAt} errors={errors} onChange={(e) => this.handleChangeDate("createAt", e)}>Date de création</DateTimePick>
                                <TimePick identifiant="arrived" valeur={arrived} errors={errors} onChange={(e) => this.handleChangeDate("arrived", e)} includeTimes={includeTimesMorning}>Heure d'arrivée</TimePick>
                            </div>

                            <div className="line line-2">
                                <Input identifiant="postalCode" valeur={postalCode} errors={errors} onChange={this.handleChangePostalCodeCity} type="number" >Code postal</Input>
                                <Input identifiant="city" valeur={city} errors={errors} onChange={this.handleChange}>Ville</Input>
                            </div>

                            <div className="line line-2">
                                <Drop ref={this.inputAvatar} identifiant="avatar" errors={errors} accept={"image/*"} maxFiles={1}
                                      label="Téléverser un avatar" labelError="Seules les images sont acceptées.">Fichier</Drop>
                                <Drop ref={this.inputFiles} identifiant="files" errors={errors} accept={"image/*"} maxFiles={3}
                                      label="Téléverser des fichiers" labelError="Seules les images sont acceptées.">FichierS</Drop>
                            </div>

                            <div className="line">
                                <Checkbox isSwitcher={true} items={switcherItems} identifiant="question" valeur={question} errors={errors} onChange={this.handleChange}>Question ?</Checkbox>
                            </div>

                            <div className="line line-2">
                                <SelectizeMultiple ref={this.selectMultiple} items={selectUsers} identifiant="users" valeur={users}
                                                   placeholder={"Sélectionner un/des utilisateurs"}
                                                   errors={errors}
                                                   onChangeAdd={(e) => this.handleChangeSelectMultipleAdd("users", e)}
                                                   onChangeDel={(e) => this.handleChangeSelectMultipleDel("users", e)}
                                >
                                    Utilisateurs concernés
                                </SelectizeMultiple>
                                <div className="form-group" />
                            </div>

                            <div className="form-button">
                                <Button isSubmit={true}>Test Error</Button>
                            </div>

                        </form>
                    </div>
                </section>
            </>
        )
    }
}