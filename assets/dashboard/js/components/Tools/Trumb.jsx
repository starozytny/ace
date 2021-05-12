import React from 'react';

import Routing     from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Trumbowyg from 'react-trumbowyg';
import 'react-trumbowyg/dist/trumbowyg.min.css';
import '@nodeModulesFolder/trumbowyg/dist/plugins/base64/trumbowyg.base64';
import '@nodeModulesFolder/trumbowyg/dist/plugins/cleanpaste/trumbowyg.cleanpaste';
import '@nodeModulesFolder/trumbowyg/dist/plugins/colors/trumbowyg.colors';
import '@nodeModulesFolder/trumbowyg/dist/plugins/colors/ui/sass/trumbowyg.colors.scss';
import '@nodeModulesFolder/trumbowyg/dist/plugins/fontsize/trumbowyg.fontsize';
import '@nodeModulesFolder/trumbowyg/dist/plugins/pasteimage/trumbowyg.pasteimage';
import '@nodeModulesFolder/trumbowyg/dist/plugins/history/trumbowyg.history';
import '@nodeModulesFolder/trumbowyg/dist/plugins/upload/trumbowyg.upload';

import { ClassiqueStructure }               from "@dashboardComponents/Tools/Fields";

export function Trumb (props){
    const { identifiant, valeur, onChange, errors, url, reference, children } = props;

    let content = <Trumbowyg id={identifiant}
                             buttons={
                                 [
                                     ['viewHTML'],
                                     ['historyUndo', 'historyRedo'],
                                     ['formatting'],
                                     ['fontsize'],
                                     'btnGrp-semantic',
                                     ['link'],
                                     ['insertImage'],
                                     ['upload'],
                                     ['base64'],
                                     ['foreColor', 'backColor'],
                                     'btnGrp-justify',
                                     'btnGrp-lists',
                                     ['horizontalRule'],
                                     ['fullscreen']
                                 ]
                             }
                             data={valeur}
                             placeholder=''
                             onChange={onChange}
                             ref={reference}
                             plugins= {{
                                 upload: {
                                     serverPath: url ? url : Routing.generate("admin_styleguide_react"),
                                     fileFieldName: 'image',
                                     urlPropertyName: 'data.link'
                                 }
                             }}
    />

    return (<ClassiqueStructure {...props} content={content} label={children} />)
}