import React from "react";
import { SimpleSelect } from 'react-selectize';

/***************************************
 * INPUT Classique
 ***************************************/
export function Input (props) {
    const { type="text", identifiant, valeur, onChange, children, placeholder, min="", max="" } = props;

    let content = <input type={type} name={identifiant} id={identifiant} placeholder={placeholder} value={valeur} onChange={onChange}/>

    if(type === "number"){
        content = <input type={type} min={min} max={max} name={identifiant} id={identifiant} placeholder={placeholder} value={valeur} onChange={onChange}/>
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
    const {items, identifiant, valeur, onChange, children} = props;

    let itemsInputs = items.map((elem, index) => {

        // get checker value
        let isChecked = false
        valeur.map(el => {
            if (el === elem.value){ isChecked = true }
        })

        return <div className={"checkbox-item " + (isChecked ? 'checked' : '')} key={index}>
            <label htmlFor={elem.identifiant}>
                {elem.label}
                <input type="checkbox" name={identifiant} id={elem.identifiant} value={elem.value} checked={isChecked ? 'checked' : ''} onChange={onChange}/>
            </label>
        </div>
    })

    let content = <div className="checkbox-items">{itemsInputs}</div>
    return (<ClassiqueStructure {...props} content={content} label={children} classForm="form-group-checkbox " />)
}

/***************************************
 * RADIOBOX Classique
 ***************************************/
export function Radiobox(props) {
    const {items, identifiant, valeur, onChange, children} = props;

    let itemsInputs = items.map((elem, index) => {

        let isChecked = false
        if (parseInt(valeur) === elem.value){ isChecked = true }

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
    const { items, identifiant, valeur, onChange, children } = props;

    let choices = items.map((item, index) =>
        <option key={index} value={item.value}>{item.label}</option>
    )

    let content = <select value={valeur} id={identifiant} name={identifiant} onChange={onChange}>
        <option value="" />
        {choices}
    </select>
    return (<ClassiqueStructure {...props} content={content} label={children} />)
}

/***************************************
 * SELECT React selectize
 ***************************************/
export function SelectReactSelectize(props) {
    const { items, identifiant, valeur, onChange, children, placeholder } = props;

    let choices = items.map((item, index) =>
        <option key={index} value={item.value}>{item.label}</option>
    )

    let content = <>
        <SimpleSelect placeholder={placeholder} onValueChange={onChange}>
            {choices}
        </SimpleSelect>
        <input type="hidden" name={identifiant} value={valeur}/>
    </>

    return (<ClassiqueStructure {...props} content={content} label={children} />)
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
            <div className="error">{error ? <><span className='icon-warning'/>{error}</> : null}</div>
        </div>
    )
}