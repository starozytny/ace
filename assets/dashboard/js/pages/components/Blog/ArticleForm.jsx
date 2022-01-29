import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Radiobox, Select } from "@dashboardComponents/Tools/Fields";
import { Button }              from "@dashboardComponents/Tools/Button";
import { Trumb }               from "@dashboardComponents/Tools/Trumb";
import { Drop }                from "@dashboardComponents/Tools/Drop";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@commonComponents/functions/validateur";
import Helper                  from "@commonComponents/functions/helper";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_articles_create";
const URL_UPDATE_GROUP       = "api_articles_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

export function ArticleFormulaire ({ type, onChangeContext, onUpdateList, categories, element })
{
    let title = "Ajouter un article";
    let url = Routing.generate(URL_CREATE_ELEMENT);
    let msg = "Félicitation ! Vous avez ajouté un nouveau article !";

    if(type === "update"){
        title = "Modifier " + element.title;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisé avec succès !";
    }

    let form = <ArticleForm
        context={type}
        url={url}
        title={element ? element.title : ""}
        introduction={element ? element.introduction : ""}
        content={element ? element.content : ""}
        category={element ? element.category : ""}
        visibleBy={element ? element.visibleBy : 0}
        categories={categories}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class ArticleForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: props.title,
            introduction: { value: props.introduction ? props.introduction : "", html: props.introduction ? props.introduction : "" },
            content: { value: props.content ? props.content : "", html: props.content ? props.content : "" },
            category: props.category.id ? props.category.id : "",
            visibleBy: props.visibleBy,
            errors: []
        }

        this.inputFile = React.createRef();
        this.inputFile1 = React.createRef();
        this.inputFile2 = React.createRef();
        this.inputFile3 = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTrumb = this.handleChangeTrumb.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        Helper.toTop();
        document.getElementById("title").focus()
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeTrumb = (e) => {
        let name = e.currentTarget.id;
        let text = e.currentTarget.innerHTML;

        this.setState({[name]: {value: [name].value, html: text}})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;
        const { title, category } = this.state;

        this.setState({ errors: [], success: false })

        let file = this.inputFile.current.drop.current.files;
        let file1 = this.inputFile1.current.drop.current.files;
        let file2 = this.inputFile2.current.drop.current.files;
        let file3 = this.inputFile3.current.drop.current.files;

        let paramsToValidate = [
            {type: "text", id: 'title',     value: title},
            {type: "text", id: 'category',  value: category},
        ];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)

        // check validate success
        if(!validate.code){
            this.setState({ errors: validate.errors });
        }else{
            let formData = new FormData();
            formData.append("data", JSON.stringify(this.state));

            if(file[0]){ formData.append('file', file[0].file);}
            if(file1[0]){ formData.append('file1', file1[0].file);}
            if(file2[0]){ formData.append('file2', file2[0].file);}
            if(file3[0]){ formData.append('file3', file3[0].file);}

            Formulaire.loader(true);
            let self = this;
            axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {
                    let data = response.data;
                    if(self.props.onUpdateList){
                        self.props.onUpdateList(data);
                    }
                    if(self.props.onChangeContext){
                        self.props.onChangeContext("list");
                    }
                    toastr.info(messageSuccess);
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
        const { context, categories } = this.props;
        const { errors, title, introduction, content, category, visibleBy } = this.state;

        let selectItems = [];
        categories.forEach(el => {
            selectItems.push({ value: el.id, label: el.name, identifiant: el.slug })
        })

        let visibleItems = [
            { value: 0, label: "Tout le monde", identifiant: "tlm" },
            { value: 1, label: "Membres",       identifiant: "members" },
        ]

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="line line-2">
                    <Input valeur={title} identifiant="title" errors={errors} onChange={this.handleChange} >Titre de l'article</Input>
                    <Select items={selectItems} identifiant="category" valeur={category} errors={errors} onChange={this.handleChange}>A quelle catégorie appartient cet article ?</Select>
                </div>


                <div className="line line-2">
                    <Radiobox items={visibleItems} identifiant="visibleBy" valeur={visibleBy} errors={errors} onChange={this.handleChange}>
                        Visible par
                    </Radiobox>
                    <div className="form-group" />
                </div>

                <div className="line">
                    <Drop ref={this.inputFile} identifiant="file" errors={errors} accept={"image/*"} maxFiles={1}
                          label="Téléverser une image" labelError="Seules les images sont acceptées.">Illustration</Drop>
                </div>

                <div className="line">
                    <Trumb valeur={introduction.value} identifiant="introduction" errors={errors} onChange={this.handleChangeTrumb} >Introduction</Trumb>
                </div>

                <div className="line">
                    <Trumb valeur={content.value} identifiant="content" errors={errors} onChange={this.handleChangeTrumb} >Contenu de l'article</Trumb>
                </div>

                <div className="line line-3">
                    <Drop ref={this.inputFile1} identifiant="file1" errors={errors} accept={"*"} maxFiles={1}
                          label="Téléverser un document" labelError="Erreur.">Document 1</Drop>
                    <Drop ref={this.inputFile2} identifiant="file2" errors={errors} accept={"*"} maxFiles={1}
                          label="Téléverser un document" labelError="Erreur.">Document 2</Drop>
                    <Drop ref={this.inputFile3} identifiant="file3" errors={errors} accept={"*"} maxFiles={1}
                          label="Téléverser un document" labelError="Erreur.">Document 3</Drop>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? TXT_CREATE_BUTTON_FORM : TXT_UPDATE_BUTTON_FORM}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}