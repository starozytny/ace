import React, { Component } from 'react';

import axios                   from "axios";
import Routing                 from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, TextArea }     from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@commonComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

export function TestimonialFormulaire ({ type, onChangeContext, onUpdateList, element })
{
    let title = "Ajouter un témoignage";
    let url = Routing.generate('api_testimonials_create');
    let msg = "Félicitation ! Vous avez ajouté un nouveau témoignage !"

    if(type === "update"){
        title = "Modifier " + element.name;
        url = Routing.generate('api_testimonials_update', {'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisé avec succès !";
    }

    let form = <TestimonialForm
        context={type}
        url={url}
        name={element ? element.name : ""}
        work={element ? element.work : ""}
        content={element ? element.content : ""}
        onChangeContext={onChangeContext}
        onUpdateList={onUpdateList}
        messageSuccess={msg}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class TestimonialForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            content: props.content,
            work: props.work,
            errors: [],
            success: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        document.getElementById("name").focus()
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { name, content } = this.state;

        this.setState({ success: false})

        let method = "POST";
        let paramsToValidate = [
            {type: "text", id: 'name', value: name},
            {type: "text", id: 'content', value: content},
        ];

        if(context !== "create"){
            method = "PUT"
        }

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
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
                            name: '',
                            content: '',
                            work: ''
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
        const { errors, success, name, content, work } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-2">
                    <Input valeur={name} identifiant="name" errors={errors} onChange={this.handleChange}>Nom et prénom</Input>
                    <Input valeur={work} identifiant="work" errors={errors} onChange={this.handleChange}>Profession</Input>
                </div>

                <div className="line">
                    <TextArea valeur={content} identifiant="content" errors={errors} onChange={this.handleChange}>Avis</TextArea>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? "Ajouter un témoignage" : 'Modifier le témoignage'}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}