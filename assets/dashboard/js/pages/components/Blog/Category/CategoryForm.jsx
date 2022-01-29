import React, { Component } from 'react';

import axios             from "axios";
import toastr            from "toastr";
import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input }         from "@dashboardComponents/Tools/Fields";
import { Button }        from "@dashboardComponents/Tools/Button";
import { Alert }         from "@dashboardComponents/Tools/Alert";
import { FormLayout }    from "@dashboardComponents/Layout/Elements";

import Validateur        from "@commonComponents/functions/validateur";
import Helper            from "@commonComponents/functions/helper";
import Formulaire        from "@dashboardComponents/functions/Formulaire";

const URL_CREATE_ELEMENT     = "api_blog_categories_create";
const URL_UPDATE_GROUP       = "api_blog_categories_update";
const TXT_CREATE_BUTTON_FORM = "Enregistrer";
const TXT_UPDATE_BUTTON_FORM = "Enregistrer les modifications";

export function CategoryFormulaire ({ type, onChangeContext, onUpdateList, element })
{
    let title = "Ajouter une categorie";
    let url = Routing.generate(URL_CREATE_ELEMENT)
    let msg = "Félicitation ! Vous avez ajouté une nouvelle catégorie !";

    if(type === "update"){
        title = "Modifier " + element.name;
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
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
        Helper.toTop();
        document.getElementById("name").focus()
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url, context, messageSuccess } = this.props;
        const { name } = this.state;

        this.setState({ errors: [], success: false })

        let paramsToValidate = [
            {type: "text", id: 'name', value: name}
        ];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)

        // check validate success
        if(!validate.code){
            Formulaire.showErrors(this, validate)
        }else{
            let method = context === "create" ? "POST" : "PUT";
            Formulaire.loader(true);
            let self = this;
            axios({ method: method, url: url, data: this.state })
                .then(function (response) {
                    let data = response.data;
                    Helper.toTop();

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
        const { context } = this.props;
        const { errors, name } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="line">
                    <Input valeur={name} identifiant="name" errors={errors} onChange={this.handleChange} >Nom de la catégorie</Input>
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