import "../../css/pages/testimonials.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Testimonials } from "./components/Testimonials/Testimonials";

Routing.setRoutingData(routes);

let el = document.getElementById("testimonials");
if(el){
    render(<Testimonials />, el)
}