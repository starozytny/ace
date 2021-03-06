import React, { Component } from "react";

export class Slider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: 1,
            interval: null,
            data1: JSON.parse(props.temoignages),
            data2: JSON.parse(props.temoignages2),
            data3: JSON.parse(props.temoignages3),
            offset: JSON.parse(props.temoignages3).length !== 0 ? 3 : 2
        }

        this.handleInterval = this.handleInterval.bind(this);
        this.handleClearInterval = this.handleClearInterval.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount () {
        let interval = this.handleInterval();

        this.setState({ interval })
    }

    handleInterval = () => {
        const { offset } = this.state;

        const self = this; let i = 1;

        return setInterval(() => {
            if(i % offset === 0){
                i = 1;
            }else{
                i = i + 1;
            }
            self.setState({ active : i })

        }, 3000);
    }

    handleClearInterval = () => {
        const { interval } = this.state;
        clearInterval(interval);
        this.setState({ interval: null })
    }

    handleClick = (number) => {
        this.setState({ active: number });
        this.handleClearInterval();
    }

    render () {
        const { active, data1, data2, data3 } = this.state;

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
                {data3.length !== 0 && <div className={"slide slide-3" + (active === 3 ? " active" : "")}>
                    {items3}
                </div>}
            </div>
            <div className="slide-dot">
                <div onClick={() => this.handleClick(1)} className={active === 1 ? " active" : ""} />
                <div onClick={() => this.handleClick(2)} className={active === 2 ? " active" : ""}/>
                {data3.length !== 0 && <div onClick={() => this.handleClick(3)} className={active === 3 ? " active" : ""}/>}
            </div>
        </div>
    }
}

function Item ({ temoignage, i }) {
    return <div className="item" data-aos="zoom-in-down" data-aos-delay={i} >
        <div className="guil1"><img src={'/build/app/images/guillemet_1.png'} alt="guillemet" /></div>
        <div className="name">{temoignage.name}</div>
        <div className="profession">{temoignage.work}</div>
        <div className="content">
            {temoignage.content}
        </div>
        <div className="guil2"><img src={'/build/app/images/guillemet_1.png'} alt="guillemet" /></div>
    </div>
}