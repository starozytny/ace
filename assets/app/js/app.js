import '../css/app.scss';

import React from 'react';
import { render } from 'react-dom';
import { Menu } from "@dashboardComponents/Layout/Menu";

const menu = document.getElementById("menu");
render(
    <Menu {...menu.dataset} />, menu
)

// let menu = document.querySelector(".nav-mobile");
// if(menu){
//     let menuBody = document.querySelector(".nav-body");
//     menu.addEventListener('click', function (){
//         if(menuBody.classList.contains('true')){
//             menuBody.classList.remove('true');
//         }else{
//             menuBody.classList.add('true');
//         }
//     })
// }