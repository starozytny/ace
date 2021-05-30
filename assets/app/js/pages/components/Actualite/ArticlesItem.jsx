import React, { Component } from 'react';

import Routing           from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

export class ArticlesItem extends Component {
    render () {
        const { elem } = this.props

        return <div className="item">

            <div className="item-content">
                <div className="item-body">
                    <a href={Routing.generate('app_article', {'slug': elem.slug})} className="infos">
                        <div className="image">
                            <div className="cat">
                                <span>Catégorie</span>
                            </div>
                            <img src={'articles/' + elem.file} alt="illustration article"/>
                        </div>
                        <div className="article">
                            <div className="name">
                                <span>{elem.title}</span>
                            </div>
                            <div className="content-wrap">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
                                    diam nonummy nibh euismod tincidunt ut laoreet dolore
                                    magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
                                    quis nostrud exerci tation ullamcorper suscipit lobortis nisl
                                </p>
                            </div>
                            <div className="createdAt">{elem.createAtString}</div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    }
}