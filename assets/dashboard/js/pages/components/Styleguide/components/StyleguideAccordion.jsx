import React from "react";

import { Accordion } from "@dashboardComponents/Tools/Accordion";

export function StyleguideAccordion () {
    let divStyle = {
        marginBottom: "12px"
    }

    let divStyle2 = {
        marginBottom: "12px",
        marginTop: "24px"
    }

    let data = [
        {id: 0, title: "Item 1", content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>"},
        {id: 1, title: "Item 2", content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>"},
        {id: 2, title: "Item 3", content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>"}
    ]

    return (
        <section>
            <h2>Accordion</h2>
            <div className="alerts-items">
                <p style={divStyle}>Accordion simple</p>
                <Accordion data={data}/>
                <p style={divStyle2}>Accordion multiple</p>
                <Accordion data={data} multiple={true}/>
            </div>
        </section>
    )
}