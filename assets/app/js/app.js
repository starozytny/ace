import '../css/app.scss';

import React from 'react';
import { render } from 'react-dom';
import { Menu } from "@dashboardComponents/Layout/Menu";

const menu = document.getElementById("menu");
render(
    <Menu {...menu.dataset} />, menu
)