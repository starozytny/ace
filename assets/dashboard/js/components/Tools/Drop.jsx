import React, { Component }   from 'react';
import toastr                 from 'toastr';
import Dropzone               from 'react-dropzone-uploader';

import Formulaire             from '@dashboardComponents/functions/Formulaire';
import { ClassiqueStructure } from "@dashboardComponents/Tools/Fields";

export class Drop extends Component {
    constructor (props) {
        super(props)

        this.state = {
            files: []
        }

        this.drop = React.createRef();

        this.handleChangeStatus = this.handleChangeStatus.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getUploadParams = this.getUploadParams.bind(this)
    }

    getUploadParams = (e) => {
        Formulaire.loader(true);
        if(this.props.onGetFile){
            this.props.onGetFile(e);
        }
        return { url: 'https://httpbin.org/post' }
    }

    handleChangeStatus = ({meta, remove}, status) => {
        const { labelError } = this.props;

        if (status === 'headers_received') {
            toastr.info(`${meta.name} téléchargé !`);
            if(this.props.remove){
                remove();
            }else{
                Formulaire.loader(false);
            }
        } else if (status === 'aborted' || status === "error_upload" || status === "exception_upload") {
            toastr.error(`${meta.name}, n'a pas pu être téléchargé.`);
            Formulaire.loader(false)
        } else if (status === 'rejected_file_type') {
            toastr.error(labelError);
            Formulaire.loader(false);
        } else if (status === 'rejected_max_files') {
            toastr.error("Nombre max de fichiers atteints.");
            Formulaire.loader(false);
        } else if (status === 'error_file_size') {
            toastr.error("Le fichier est trop volumineux.");
            Formulaire.loader(false);
        } else if (status === 'removed') {
            if(this.props.onRemoveFile){
                this.props.onRemoveFile();
            }
        }
    }

    handleSubmit = (files, allFiles) => {
        allFiles.forEach(f => f.remove())
    }

    render () {
        const { file, folder, children, accept, maxFiles, labelError, label, labelFiles="Ajouter" } = this.props;

        let content = <div className="form-files">
            {file && folder && <div className="preview-form-oldFile">
                <img src={"/" + folder + "/" + file} alt="preview file"/>
            </div>}
            <Dropzone
                ref={this.drop}
                getUploadParams={this.getUploadParams}
                onChangeStatus={this.handleChangeStatus}
                accept={accept}
                maxFiles={maxFiles}
                multiple={maxFiles > 1}
                canCancel={false}
                inputContent={(files, extra) => (extra.reject ? labelError : label)}
                inputWithFilesContent={labelFiles}
            />
        </div>

        return <ClassiqueStructure {...this.props} content={content} label={children} />
    }
}