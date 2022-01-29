import '../css/app.scss';
import '@commonComponents/functions/toastrOptions';

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from 'react';
import { render } from 'react-dom';
import { Menu } from './components/Layout/Menu';
import { Theme } from "@dashboardComponents/Theme";
import { Notifications } from "@dashboardComponents/Notifications";

Routing.setRoutingData(routes);

const menu = document.getElementById("menu");
if(menu) {
    render(<Menu {...menu.dataset} />, menu)
}

const theme = document.getElementById("theme");
if(theme){
    render(<Theme />, theme)
}

const notifications = document.getElementById("notifications");
if(notifications){
    render(<Notifications {...notifications.dataset} />, notifications)
}