import React, { Component } from 'react';

import axios             from "axios";
import toastr            from "toastr";
import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input }         from "@dashboardComponents/Tools/Fields";
import { Button }        from "@dashboardComponents/Tools/Button";

import Validateur        from "@dashboardComponents/functions/validateur";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

import { FormLayout }    from "@dashboardComponents/Layout/Elements";

export function CategoryFormulaire ({ type, onChangeContext, onUpdateList, element })
{
    let title = "Ajouter une categorie";
    let url = Routing.generate('api_blog_categories_create')
    let msg = "Félicitation ! Vous avez ajouté une nouvelle catégorie !";

    if(type === "update"){
        title = "Modifier " + element.name;
        url = Routing.generate('api_blog_categories_update', {'id': element.id});
        msg = "Félicitation ! La mise à jour s'est réalisé avec succès !";
    }

    let form = <CategoryForm
        context={type}
        url={url}
        name={element ? element.name : ""}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class CategoryForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            errors: []
        }

        this.inputFile = React.createRef();

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

        const { url, messageSuccess } = this.props;
        const { name } = this.state;

        this.setState({ success: false})

        let paramsToValidate = [
            {type: "text", id: 'name', value: name}
        ];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)

        // check validate success
        if(!validate.code){
            this.setState({ errors: validate.errors });
        }else{
            let formData = new FormData();
            formData.append('name', name);

            Formulaire.loader(true);
            let self = this;
            axios({ method: "POST", url: url, data: formData })
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
        const { errors, name } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="line">
                    <Input valeur={name} identifiant="name" errors={errors} onChange={this.handleChange} >Nom de la catégorie</Input>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? "Ajouter la catégorie" : 'Modifier la catégorie'}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}