import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";

import { Input }               from "@dashboardComponents/Tools/Fields";
import { Button }              from "@dashboardComponents/Tools/Button";
import { Trumb }               from "@dashboardComponents/Tools/Trumb";
import { Drop }                from "@dashboardComponents/Tools/Drop";

import Validateur              from "@commonComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

export class AtelierForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            content: { value: props.content ? props.content : "", html: props.content ? props.content : "" },
            min: props.min,
            max: props.max,
            errors: []
        }

        this.inputFile = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTrumb = this.handleChangeTrumb.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        document.getElementById("name").focus()
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeTrumb = (e) => {
        let val = this.state.content.value;
        this.setState({ [e.currentTarget.id]: { value: val, html: e.currentTarget.innerHTML } })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;
        const { name, content, min, max } = this.state;

        this.setState({ success: false})

        let file = this.inputFile.current.drop.current.files;
        let paramsToValidate = [
            {type: "text", id: 'name', value: name},
            {type: "text", id: 'content', value: content.html},
            {type: "text", id: 'min', value: min},
            {type: "text", id: 'max', value: max},
        ];

        let formData = new FormData();

        // validate global
        let validate = Validateur.validateur(paramsToValidate)

        if(file.length !== 0){
            if(file[0]){
                formData.append('file', file[0].file);
            }
        }else{
            validate.errors.push({
                name: "file",
                message: "Champs obligatoire"
            })
        }

        // check validate success
        if(!validate.code){
            this.setState({ errors: validate.errors });
        }else{

            formData.append('name', name);
            formData.append('content', content.html);
            formData.append('min', min);
            formData.append('max', max);

            Formulaire.loader(true);
            let self = this;
            axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {
                    let data = response.data;
                    self.props.onUpdateList(data);
                    self.props.onChangeContext("list");
                    toastr.info(messageSuccess);
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
        const { errors, name, content, min, max } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="line">
                    <Input valeur={name} identifiant="name" errors={errors} onChange={this.handleChange} >Titre de l'activité</Input>
                </div>

                <div className="line">
                    <Drop ref={this.inputFile} identifiant="file" errors={errors} accept={"image/*"} maxFiles={1}
                          label="Téléverser une image" labelError="Seules les images sont acceptées.">Image de fond</Drop>
                </div>

                <div className="line line-2">
                    <Input valeur={min} identifiant="min" errors={errors} onChange={this.handleChange} type="number">Min</Input>
                    <Input valeur={max} identifiant="max" errors={errors} onChange={this.handleChange} type="number">Max</Input>
                </div>

                <div className="line">
                    <Trumb valeur={content.value} identifiant="content" errors={errors} onChange={this.handleChangeTrumb} >Contenu de l'article</Trumb>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? "Ajouter l'atelier" : 'Modifier l\'atelier'}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}