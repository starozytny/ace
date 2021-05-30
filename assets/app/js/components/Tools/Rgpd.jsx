import React from "react";

import Routing   from "@publicFolder/bundles/fosjsrouting/js/router.min";
import { Alert } from "@dashboardComponents/Tools/Alert";

export function RgpdInfo(props){
    const { children, utility } = props;

    let content = <>
        Les données à caractère personnel collectées dans ce formulaire sont enregistrées dans un fichier
        informatisé permettant {utility}.  <br/>
        En validant ce formulaire, vous consentez à nous transmettre vos données pour traiter votre demande
        et vous recontacter si besoin.
    </>
    if(children){
        content = children;
    }

    return <Alert>
        {content}
        <br/>
        Plus d'informations sur le traitement de vos données dans notre <a target="_blank" href={Routing.generate('app_politique')}>politique de confidentialité</a>.
    </Alert>
}