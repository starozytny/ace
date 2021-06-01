import "../../css/pages/services.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Services } from "./components/Services/Services";

Routing.setRoutingData(routes);

let el = document.getElementById("services");
if(el){
    render(<Services />, el)
}