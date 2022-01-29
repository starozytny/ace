import React, { Component } from "react";

import { MultiSelect, SimpleSelect } from 'react-selectize';

/***************************************
 * INPUT Classique
 ***************************************/
export function Input (props) {
    const { type="text", identifiant, valeur, onChange, children, placeholder, min="", max="", step=1,
        isMultiple=false, acceptFiles="" } = props;

    let content = <input type={type} name={identifiant} id={identifiant} placeholder={placeholder} value={valeur} onChange={onChange}/>

    if(type === "number"){
        content = <input type={type} min={min} max={max} step={step} name={identifiant} id={identifiant} placeholder={placeholder} value={valeur} onChange={onChange}/>
    }

    if(type === "file"){
        content = <input type={type} multiple={isMultiple} name={identifiant} id={identifiant} accept={acceptFiles} onChange={onChange}/>
    }

    return (<ClassiqueStructure {...props} content={content} label={children} />)
}
/***************************************
 * TEXTAREA Classique
 ***************************************/
export function TextArea (props) {
    const { identifiant, valeur, onChange, rows="8", children, placeholder } = props;

    let content = <textarea name={identifiant} id={identifiant} value={valeur} rows={rows} onChange={onChange} placeholder={placeholder}/>
    return (<ClassiqueStructure {...props} content={content} label={children} />)
}

/***************************************
 * CHECKBOX Classique
 ***************************************/
export function Checkbox (props) {
    const {items, identifiant, valeur, onChange, children, isSwitcher = false} = props;

    let classeItems = isSwitcher ? "switcher-items" : "checkbox-items";

    let itemsInputs = items.map((elem, index) => {

        // get checker value
        let isChecked = false
        valeur.map(el => {
            if (el === elem.value){ isChecked = true }
        })

        let classeItem = isSwitcher ? "switcher-item" : "checkbox-item";

        return <div className={classeItem + " " + (isChecked ? 'checked' : '')} key={index}>
            <label htmlFor={elem.identifiant}>
                <span>{elem.label}</span>
                <input type="checkbox" name={identifiant} id={elem.identifiant} value={elem.value} checked={isChecked ? 'checked' : ''} onChange={onChange}/>
            </label>
        </div>
    })

    let content = <div className={classeItems}>{itemsInputs}</div>
    return (<ClassiqueStructure {...props} content={content} label={children} classForm="form-group-checkbox " />)
}

/***************************************
 * RADIOBOX Classique or Switcher
 ***************************************/
export function Radiobox(props) {
    const {items, identifiant, valeur, onChange, children, convertValToInt = true} = props;

    let itemsInputs = items.map((elem, index) => {

        let isChecked = false

        let vl = convertValToInt ? parseInt(valeur) : valeur;
        if (vl === elem.value){ isChecked = true }

        return <div className={"radiobox-item " + (isChecked ? 'checked' : '')} key={index}>
            <label htmlFor={elem.identifiant}>
                <span>{elem.label}</span>
                <input type="radio" name={identifiant} id={elem.identifiant} value={elem.value} checked={isChecked ? 'checked' : ''} onChange={onChange}/>
            </label>
        </div>
    })

    let content = <div className="radiobox-items">{itemsInputs}</div>

    return (<ClassiqueStructure {...props} content={content} label={children} classForm="form-group-radiobox " />)
}

/***************************************
 * SELECT Classique
 ***************************************/
export function Select(props) {
    const { items, identifiant, valeur, onChange, children, noEmpty=false } = props;

    let choices = items.map((item, index) =>
        <option key={index} value={item.value}>{item.label}</option>
    )

    let content = <select value={valeur} id={identifiant} name={identifiant} onChange={onChange}>
        {noEmpty ? null : <option value="" />}

        {choices}
    </select>
    return (<ClassiqueStructure {...props} content={content} label={children} />)
}

/***************************************
 * SELECT React selectize
 ***************************************/
export function SelectReactSelectize(props) {
    const { items, identifiant, valeur, onChange, children, placeholder } = props;

    let defaultValeur = "";
    let choices = items.map((item, index) => {
        if(item.value === valeur){
            defaultValeur = {value: item.value, label: item.label}
        }
        return <option key={index} value={item.value}>{item.label}</option>
    })

    let content = <>
        <SimpleSelect defaultValue={defaultValeur} placeholder={placeholder} onValueChange={onChange}>
            {choices}
        </SimpleSelect>
        <input type="hidden" name={identifiant} value={valeur}/>
    </>

    return (<ClassiqueStructure {...props} content={content} label={children} />)
}

export class SelectizeMultiple extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: props.items,
            valeurs: props.valeur
        }

        this.handleUpdateValeurs = this.handleUpdateValeurs.bind(this);
    }

    handleUpdateValeurs = (valeurs) => { this.setState({ valeurs }) }

    render () {
        const { identifiant, onChangeAdd, onChangeDel, children, placeholder } = this.props;
        const { items, valeurs } = this.state;

        let content = <>
            <MultiSelect defaultValues={valeurs} options={items} values={valeurs} placeholder={placeholder} onValuesChange={onChangeAdd}
                         renderValue = {function(item){
                             return <div className="simple-value" onClick={() => onChangeDel(item)}>
                                 <span className="icon-cancel"/>
                                 <span>{item.label}</span>
                             </div>
                         }}
            />
            <input type="hidden" name={identifiant} value={valeurs}/>
        </>

        return <ClassiqueStructure {...this.props} content={content} label={children} />
    }
}

/***************************************
 * STRUCTURE
 ***************************************/
export function ClassiqueStructure({identifiant, content, errors, label, classForm=""}){

    let error;
    if(errors.length !== 0){
        errors.map(err => {
            if(err.name === identifiant){
                error = err.message
            }
        })
    }

    return (
        <div className={classForm + 'form-group' + (error ? " form-group-error" : "")}>
            <label htmlFor={identifiant}>{label}</label>
            {content}
            <div className="error">{error ? <><span className='icon-error'/>{error}</> : null}</div>
        </div>
    )
}