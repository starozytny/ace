import React from "react";

import {Button, ButtonDropdown, ButtonIcon, ButtonIconDropdown} from "@dashboardComponents/Tools/Button";

export function StyleguideButton () {

    let items = [
        {data: <a href="/">Link 1</a>},
        {data: <a href="/">Link 2</a>},
        {data: <a href="/">Link 3</a>},
        {data: <div>Div 1</div>},
    ]

    return (
        <section>
            <h2>Boutons</h2>
            <div className="buttons-items">

                <Button type="default">Default</Button>
                <Button>Primary</Button>
                <Button type="danger">Danger</Button>
                <Button type="warning">Warning</Button>
                <Button type="success">Success</Button>
                <Button type="default" icon="padlock">Default</Button>

                <ButtonIcon icon="pencil">Modifier</ButtonIcon>
                <ButtonIcon icon="pencil" text="Default" />

            </div>

            <div className="buttons-items">

                <Button outline={true} type="default">Default</Button>
                <Button outline={true}>Primary</Button>
                <Button outline={true} type="danger">Danger</Button>
                <Button outline={true} type="warning">Warning</Button>
                <Button outline={true} type="success">Success</Button>
                <Button outline={true} type="default" icon="padlock">Default</Button>

            </div>

            <div className="buttons-items">
                <ButtonDropdown type="default" icon="padlock" items={items}>Dropdown</ButtonDropdown>
                <ButtonIconDropdown icon="pencil" items={items}>Modifier</ButtonIconDropdown>
                <ButtonIconDropdown icon="pencil" text="Default" items={items} />
            </div>
        </section>
    )
}