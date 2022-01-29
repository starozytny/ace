import React from "react";

import { Alert } from "@dashboardComponents/Tools/Alert";

export function StyleguideAlert () {
    return (
        <section>
            <h2>Alerts</h2>
            <div className="alerts-items">

                <Alert>Default</Alert>
                <Alert type="info">Info</Alert>
                <Alert type="danger">Danger</Alert>
                <Alert type="warning">Warning</Alert>
                <Alert type="reverse">Reverse</Alert>

                <Alert title="Title">Default</Alert>

                <Alert withIcon={false} title="Title">Default</Alert>

                <Alert withIcon={false}>Default</Alert>

            </div>
        </section>
    )
}