import "../../css/pages/notifications.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";

import { Notifications } from "./components/Notifications/Notifications";

Routing.setRoutingData(routes);

let el = document.getElementById("notifications-list");
if(el){
    render(<Notifications {...el.dataset} />, el)
}
