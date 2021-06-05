import React, { Component } from 'react';

import Routing      from '@publicFolder/bundles/fosjsrouting/js/router.min.js';
import parse        from "html-react-parser";

export class ArticlesItem extends Component {
    render () {
        const { elem } = this.props

        let intro = elem.intro ? parse(elem.intro) : null;
        let content = elem.content ? parse(elem.content) : null;

        return <div className="item">

            <div className="item-content">
                <div className="item-body">
                    <a href={Routing.generate('app_article', {'slug': elem.slug})} className="infos">
                        <div className="image">
                            <div className="cat">
                                <span>{elem.category.name}</span>
                            </div>
                            <img src={'articles/' + elem.file} alt="illustration article"/>
                        </div>
                        <div className="article">
                            <div className="name">
                                <span>{elem.title}</span>
                            </div>
                            <div className="content-wrap">
                                {intro ? intro : (content ? content : null)}
                            </div>
                            <div className="createdAt">{elem.createAtString}</div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    }
}