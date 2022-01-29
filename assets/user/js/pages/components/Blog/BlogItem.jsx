import React, { Component } from 'react';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

export class BlogItem extends Component {
    render () {
        const { isFromApp=false, elem } = this.props

        let url = isFromApp ? "app_blog_read" : "user_blog_read";

        return <div className="item">
            <a href={Routing.generate(url, {"slug": elem.slug})}>{elem.title}</a>
        </div>
    }
}