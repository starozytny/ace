import '../css/app.scss';

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from 'react';
import toastr from 'toastr';
import { render } from 'react-dom';
import { Menu } from './components/Layout/Menu';
import { Notifications } from "@dashboardComponents/Notifications";

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
    "hideMethod": "fadeOut",
    "escapeHtml": false,
}

Routing.setRoutingData(routes);

const menu = document.getElementById("menu");
render(
    <Menu {...menu.dataset} />, menu
)

const notifications = document.getElementById("notifications");
if(notifications){
    render(
        <Notifications {...notifications.dataset} />, notifications
    )
}
