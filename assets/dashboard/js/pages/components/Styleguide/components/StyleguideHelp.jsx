import React, { Component } from "react";

import { Button } from "@dashboardComponents/Tools/Button";
import { HelpBubble } from "@dashboardComponents/Tools/HelpBubble";

export class StyleguideHelp extends Component {
    constructor(props) {
        super();

        this.helpBubble = React.createRef();

        this.handleOpen = this.handleOpen.bind(this);
    }

    handleOpen = () => {
        this.helpBubble.current.handleOpen();
    }

    render () {

        let content = <div>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent bibendum et turpis vitae accumsan. Vivamus et molestie ipsum. Vestibulum dapibus est ex, nec blandit mauris pellentesque eu. Vivamus non viverra nisl, vel ultrices lacus. Donec volutpat suscipit lorem hendrerit consectetur. Mauris aliquet eros ut venenatis sodales. Morbi nec condimentum nunc, a tristique ante. Vivamus maximus risus et velit blandit, eu laoreet diam tincidunt. Fusce vel dolor vel arcu vestibulum pellentesque nec ut ante. Vivamus vel molestie urna, vel consequat justo. Vivamus rhoncus feugiat elementum. Donec tincidunt purus a urna ultricies, eu fringilla diam laoreet.

                Praesent rhoncus interdum velit. Nam vitae metus et libero lacinia ultricies. Mauris eros est, imperdiet ultricies ligula sed, ultrices malesuada felis. Pellentesque commodo lacus nec dolor ultricies, quis faucibus ipsum rhoncus. Integer convallis enim libero, in placerat ex pellentesque non. Maecenas quis volutpat velit. Donec sed facilisis nunc, et vulputate libero. Maecenas aliquam leo vitae quam lobortis, sed ultricies sem luctus. Aliquam ac felis cursus, volutpat magna ullamcorper, eleifend enim. Vivamus fermentum iaculis consequat.

                Integer commodo est ex, nec fermentum quam elementum vel. Donec nec tellus sed ipsum blandit lobortis ac non odio. Donec ac lectus in nunc pretium imperdiet. Phasellus sit amet euismod ipsum, sed fermentum nunc. Aliquam erat volutpat. Proin arcu erat, hendrerit et egestas eget, sagittis vel quam. Maecenas enim eros, imperdiet et auctor ac, viverra eu nibh. Vivamus posuere, dui et molestie gravida, sapien tellus egestas dolor, sed consequat ligula sem eget urna. Vestibulum vitae lorem ut leo sollicitudin volutpat id ut nisi. Sed a interdum neque, id semper risus. Integer sed varius sem. In molestie arcu quis vehicula interdum. Fusce vel scelerisque magna. Nulla facilisi. Vestibulum tempor nisi risus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;

                Etiam vel magna ante. Fusce tincidunt ultricies purus a venenatis. Phasellus magna lectus, congue eget lectus sed, laoreet tincidunt mauris. Sed viverra nibh nulla, non malesuada augue porta ac. Sed turpis urna, vehicula eget rutrum sit amet, finibus eget dui. Ut augue quam, posuere ut condimentum eget, auctor viverra metus. Suspendisse neque urna, finibus condimentum ullamcorper vel, elementum non ex. Maecenas vehicula mi quis tincidunt pretium. Curabitur fermentum aliquet viverra. Curabitur non ligula dictum, mattis lacus at, accumsan nibh. Pellentesque a tellus eget libero tincidunt eleifend nec eget sapien. Quisque elit sem, euismod ut nunc et, pellentesque iaculis velit.

                Fusce nec rhoncus arcu, ac venenatis purus. Quisque at facilisis neque. Nulla posuere sem vel lacinia finibus. Proin nec neque nisi. Vivamus ornare, nisl ac ultrices dictum, felis tortor euismod justo, eu rhoncus est leo nec velit. Sed porta erat pulvinar est pharetra convallis. Pellentesque faucibus elit metus, in imperdiet ex sagittis ac. Donec ut nibh vestibulum, laoreet mi eget, ultricies tortor. Nunc vestibulum lacus sit amet volutpat mollis. Donec euismod eget ex in ullamcorper. Suspendisse potenti. Pellentesque aliquet posuere magna, at pharetra justo fringilla sed.
            </p>
        </div>

        return (
            <section>
                <h2>Help Bubble</h2>
                <div className="aside-items">
                    <Button type="default" onClick={this.handleOpen}>Test helpBubble</Button>
                </div>

                <HelpBubble ref={this.helpBubble} content={content}>Test titre helpBubble</HelpBubble>
            </section>
        )
    }
}