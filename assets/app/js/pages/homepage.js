import '../../css/pages/homepage.scss';

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from 'react';
import { render } from 'react-dom';

import { ContactForm } from "./components/Contact/ContactForm";
import { Slider }      from "./components/Slider/Slider";

Routing.setRoutingData(routes);

let el = document.getElementById("contact");
if(el){
    render(<ContactForm {...el.dataset} />, el)
}

let el2 = document.getElementById("slider");
if(el2){
    render(<Slider {...el2.dataset} />, el2)
}