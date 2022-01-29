import React, { Component } from 'react';

export class HelpBubble extends Component {
    constructor (props) {
        super(props)

        this.state = {
            title: null,
            active: false
        }

        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    handleOpen = (title) => { this.setState({ active: true, title: title }) }
    handleClose = () => { this.setState({ active: false }) }

    render () {
        const { content, children, displayOverlay = true } = this.props
        const { active, title } = this.state

        return <div className={`help-bubble ${active}`}>
            {displayOverlay && <div className="help-bubble-overlay" onClick={this.handleClose} />}
            <div className="help-bubble-content">
                <div className="help-bubble-title">
                    <span className="title">{title ? title : children}</span>
                    <span className="icon-cancel" onClick={this.handleClose} />
                </div>
                {content}
            </div>
        </div>
    }
}