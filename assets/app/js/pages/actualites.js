import '../../css/pages/actualites.scss';

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from 'react';
import { render } from 'react-dom';
import { Articles } from "./components/Actualite/Articles";

Routing.setRoutingData(routes);

let el = document.getElementById("actualites");
if(el){
    render(<Articles />, el)
}