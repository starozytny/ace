import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";

import {Input, TextArea} from "@dashboardComponents/Tools/Fields";
import { Button }              from "@dashboardComponents/Tools/Button";
import { Trumb }               from "@dashboardComponents/Tools/Trumb";
import { Drop }                from "@dashboardComponents/Tools/Drop";

import Validateur              from "@dashboardComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

export class ServiceForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: props.title,
            intro: { value: props.intro ? props.intro : "", html: props.intro ? props.intro : "" },
            content: { value: props.content ? props.content : "", html: props.content ? props.content : "" },
            seance: props.seance ? props.seance : "",
            nbSeance: props.nbSeance ? props.nbSeance : "",
            errors: []
        }

        this.inputFile1 = React.createRef();
        this.inputFile2 = React.createRef();
        this.inputFile3 = React.createRef();
        this.inputFile4 = React.createRef();
        this.inputFile5 = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTrumb = this.handleChangeTrumb.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        document.getElementById("title").focus()
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeTrumb = (e) => {
        let val = this.state.intro.value;
        if(e.currentTarget.id === "content"){
            val = this.state.content.value;
        }
        this.setState({ [e.currentTarget.id]: { value: val, html: e.currentTarget.innerHTML } })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;
        const { title, intro, content, seance, nbSeance } = this.state;

        this.setState({ success: false})

        let file1 = this.inputFile1.current.drop.current.files;
        let file2 = this.inputFile2.current.drop.current.files;
        let file3 = this.inputFile3.current.drop.current.files;
        let file4 = this.inputFile4.current.drop.current.files;
        let file5 = this.inputFile5.current.drop.current.files;
        let paramsToValidate = [
            {type: "text", id: 'title', value: title},
            {type: "text", id: 'content', value: content.html},
            {type: "text", id: 'seance', value: seance},
            {type: "text", id: 'nbSeance', value: nbSeance}
        ];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)

        // check validate success
        if(!validate.code){
            this.setState({ errors: validate.errors });
        }else{
            let formData = new FormData();
            formData.append('title', title);
            formData.append('intro', intro.html);
            formData.append('content', content.html);
            formData.append('seance', seance);
            formData.append('nbSeance', nbSeance);

            if(file1 !== ""){
                if(file1[0]){
                    formData.append('file1', file1[0].file);
                }
            }
            if(file2 !== ""){
                if(file2[0]){
                    formData.append('file2', file2[0].file);
                }
            }
            if(file3 !== ""){
                if(file3[0]){
                    formData.append('file3', file3[0].file);
                }
            }
            if(file4 !== ""){
                if(file4[0]){
                    formData.append('file4', file4[0].file);
                }
            }
            if(file5 !== ""){
                if(file5[0]){
                    formData.append('file5', file5[0].file);
                }
            }

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
        const { errors, title, intro, content, seance, nbSeance } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="line">
                    <Input valeur={title} identifiant="title" errors={errors} onChange={this.handleChange} >Titre du service</Input>
                </div>

                <div className="line">
                    <Drop ref={this.inputFile1} identifiant="file1" errors={errors} accept={"image/*"} maxFiles={1}
                          label="Téléverser une image" labelError="Seules les images sont acceptées.">Image de fond</Drop>
                </div>

                <div className="line">
                    <Trumb valeur={intro.value} identifiant="intro" errors={errors} onChange={this.handleChangeTrumb} >Introduction du service</Trumb>
                </div>

                <div className="line">
                    <Trumb valeur={content.value} identifiant="content" errors={errors} onChange={this.handleChangeTrumb} >Contenu de l'article</Trumb>
                </div>

                <div className="line">
                    <TextArea valeur={seance} identifiant="seance" errors={errors} onChange={this.handleChange} >Séance</TextArea>
                </div>

                <div className="line">
                    <TextArea valeur={nbSeance} identifiant="nbSeance" errors={errors} onChange={this.handleChange} >Nombre de séances</TextArea>
                </div>

                <div className="line line-2">
                    <Drop ref={this.inputFile2} identifiant="file2" errors={errors} accept={"image/*"} maxFiles={1}
                          label="Téléverser une image" labelError="Seules les images sont acceptées.">Image 1</Drop>
                    <Drop ref={this.inputFile3} identifiant="file3" errors={errors} accept={"image/*"} maxFiles={1}
                          label="Téléverser une image" labelError="Seules les images sont acceptées.">Image 2</Drop>
                </div>
                <div className="line line-2">
                    <Drop ref={this.inputFile4} identifiant="file4" errors={errors} accept={"image/*"} maxFiles={1}
                          label="Téléverser une image" labelError="Seules les images sont acceptées.">Image 3</Drop>
                    <Drop ref={this.inputFile5} identifiant="file5" errors={errors} accept={"image/*"} maxFiles={1}
                          label="Téléverser une image" labelError="Seules les images sont acceptées.">Image 4</Drop>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? "Ajouter le service" : 'Modifier le service'}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}