import '../css/app.scss';

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from 'react';
import { render } from 'react-dom';
import { Menu } from './components/Layout/Menu';

Routing.setRoutingData(routes);

const menu = document.getElementById("menu");
render(
    <Menu {...menu.dataset} />, menu
)
