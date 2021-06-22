import '../css/app.scss';

import AOS from "aos";
const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from 'react';
import { render } from 'react-dom';

import { Menu }     from "@dashboardComponents/Layout/Menu";
import { Cookies, CookiesGlobalResponse } from "@appComponents/Tools/Cookies";

Routing.setRoutingData(routes);

const menu = document.getElementById("menu");
render(
    <Menu {...menu.dataset} />, menu
)

let cookies = document.getElementById("cookies");
render(
    <Cookies {...cookies.dataset}/>, cookies
)

let cookiesGlobalResponse = document.getElementById("cookies-global-response");
if(cookiesGlobalResponse){
    render(
        <CookiesGlobalResponse {...cookies.dataset}/>, cookiesGlobalResponse
    )
}

AOS.init();