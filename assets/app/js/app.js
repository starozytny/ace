import '../css/app.scss';

import AOS from "aos";
const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from 'react';
import toastr from 'toastr';
import { render } from 'react-dom';

import { Menu }     from "@dashboardComponents/Layout/Menu";
import { Cookies, CookiesGlobalResponse } from "@appComponents/Tools/Cookies";

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}
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