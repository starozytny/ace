import React, { Component } from "react";

export class Slider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: 1
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (number) => {
        this.setState({ active: number })
    }

    render () {
        const { temoignages, temoignages2, temoignages3 } = this.props;
        const { active } = this.state;

        let data1 = JSON.parse(temoignages);
        let data2 = JSON.parse(temoignages2);
        let data3 = JSON.parse(temoignages3);

        let items1 = []; let i=50;
        data1.forEach((temoignage, index) => {
            i = i + 50;
            items1.push(<Item temoignage={temoignage} i={i} key={index}/>)
        })

        let items2 = []; i=50;
        data2.forEach((temoignage, index) => {
            i = i + 50;
            items2.push(<Item temoignage={temoignage} i={i} key={index}/>)
        })

        let items3 = []; i=50;
        data3.forEach((temoignage, index) => {
            i = i + 50;
            items3.push(<Item temoignage={temoignage} i={i} key={index}/>)
        })

        return <div className="temoignages-slider">
            <div className="temoignages-items">
                <div className="slide slide-0">
                    {items1}
                </div>
                <div className={"slide slide-1" + (active === 1 ? " active" : "")}>
                    {items1}
                </div>
                <div className={"slide slide-2" + (active === 2 ? " active" : "")}>
                    {items2}
                </div>
                <div className={"slide slide-3" + (active === 3 ? " active" : "")}>
                    {items3}
                </div>
            </div>
            <div className="slide-dot">
                <div onClick={() => this.handleClick(1)} className={active === 1 ? " active" : ""} />
                <div onClick={() => this.handleClick(2)} className={active === 2 ? " active" : ""}/>
                <div onClick={() => this.handleClick(3)} className={active === 3 ? " active" : ""}/>
            </div>
        </div>
    }
}

function Item ({ temoignage, i }) {
    return <div className="item" data-aos="zoom-in-down" data-aos-delay={i} >
        <div className="guil1"><img src={'/build/app/images/guillemet_1.png'} alt="guillemet" /></div>
        <div className="name">{temoignage.name}</div>
        <div className="profession">{temoignage.profession}</div>
        <div className="content">
            {temoignage.avis}
        </div>
        <div className="guil2"><img src={'/build/app/images/guillemet_1.png'} alt="guillemet" /></div>
    </div>
}