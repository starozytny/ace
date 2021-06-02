import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Select }       from "@dashboardComponents/Tools/Fields";
import { Button }              from "@dashboardComponents/Tools/Button";
import { Trumb }               from "@dashboardComponents/Tools/Trumb";
import { Drop }                from "@dashboardComponents/Tools/Drop";

import Validateur              from "@dashboardComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

import { FormLayout }          from "@dashboardComponents/Layout/Elements";

export function ArticleFormulaire ({ type, onChangeContext, onUpdateList, categories, element })
{
    let title = "Ajouter un article";
    let url = Routing.generate('api_articles_create');
    let msg = "Félicitation ! Vous avez ajouté un nouveau article !";

    if(type === "update"){
        title = "Modifier " + element.title;
        url = Routing.generate('api_articles_update', {'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisé avec succès !";
    }

    let form = <ArticleForm
                    context={type}
                    url={url}
                    title={element ? element.title : ""}
                    introduction={element ? element.introduction : ""}
                    content={element ? element.content : ""}
                    category={element ? element.category : ""}
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
        document.getElementById("title").focus()
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeTrumb = (e) => {
        let val = this.state.introduction.value;
        if(e.currentTarget.id === "content"){
            val = this.state.content.value;
        }
        this.setState({ [e.currentTarget.id]: { value: val, html: e.currentTarget.innerHTML } })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, messageSuccess } = this.props;
        const { title, category, introduction, content } = this.state;

        this.setState({ success: false})

        let file = this.inputFile.current.drop.current.files;
        let paramsToValidate = [
            {type: "text", id: 'title', value: title},
            {type: "text", id: 'category', value: category},
        ];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)

        // check validate success
        if(!validate.code){
            this.setState({ errors: validate.errors });
        }else{
            let formData = new FormData();
            formData.append('title', title);
            formData.append('category', category);
            formData.append('introduction', introduction.html);
            formData.append('content', content.html);

            if(file !== ""){
                if(file[0]){
                    formData.append('file', file[0].file);
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
        const { context, categories } = this.props;
        const { errors, title, introduction, content, category } = this.state;

        let selectItems = [];
        categories.forEach(el => {
            selectItems.push({ value: el.id, label: el.name, identifiant: el.slug })
        })

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="line">
                    <Input valeur={title} identifiant="title" errors={errors} onChange={this.handleChange} >Titre de l'article</Input>
                </div>

                <div className="line">
                    <Select items={selectItems} identifiant="category" valeur={category} errors={errors} onChange={this.handleChange}>A quelle catégorie appartient cet article ?</Select>
                </div>

                <div className="line">
                    <Drop ref={this.inputFile} identifiant="file" errors={errors} accept={"image/*"} maxFiles={1}
                          label="Téléverser une image" labelError="Seules les images sont acceptées.">Image de garde</Drop>
                </div>

                <div className="line">
                    <Trumb valeur={introduction.value} identifiant="introduction" errors={errors} onChange={this.handleChangeTrumb} >Introduction</Trumb>
                </div>

                <div className="line">
                    <Trumb valeur={content.value} identifiant="content" errors={errors} onChange={this.handleChangeTrumb} >Contenu de l'article</Trumb>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? "Ajouter l'article" : 'Modifier l\'article'}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}