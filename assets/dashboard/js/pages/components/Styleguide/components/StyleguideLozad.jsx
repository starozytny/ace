import React, { Component } from "react";

import lozad from "lozad";

export class StyleguideLozad extends Component {
    componentDidMount() {
        const observer = lozad();
        observer.observe();
    }

    render () {
        return (
            <section>
                <h2>Images lazyload</h2>
                <div className="alerts-items">
                    <img className="lozad" data-src="/build/dashboard/images/thumb-1.jpg" alt="thumb1"/>
                    <img className="lozad" data-src="/build/dashboard/images/thumb-2.jpg" alt="thumb2"/>
                    <img className="lozad" data-src="/build/dashboard/images/thumb-3.jpg" alt="thumb3"/>
                    <img className="lozad" data-src="/build/dashboard/images/thumb-4.jpg" alt="thumb4"/>
                    <img className="lozad" data-src="/build/dashboard/images/thumb-5.jpg" alt="thumb5"/>
                </div>
            </section>
        )
    }

}