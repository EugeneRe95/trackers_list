import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

export class Tracker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hours: this.props.hours,
            minutes: this.props.minutes,
            seconds: this.props.seconds,
            name: this.props.name,
            mode: this.props.mode
        }
        this.pause = this.pause.bind(this);
    }
    componentDidMount() {
        const trackers = JSON.parse(localStorage.getItem('trackers'));
        if (trackers !== null) {
            trackers.forEach(item => {
                if (item.name === this.state.name) {
                    this.setState({ mode: item.mode })
                }
            })
        }
        if (this.state.mode === 'pause') {
            this.int = setInterval(() => {
                this.props.change.bind(this, this.state.name)()
            }, 1000);
        } else {
            clearInterval(this.int)
        }
    }
    pause() {
        const trackers = JSON.parse(localStorage.getItem('trackers'));
        if (this.state.mode === 'pause') {
            this.setState({ mode: 'play' })
            trackers.forEach(item=>{
                if(item.name===this.state.name){
                    item.mode='play'
                }
            })
            localStorage.setItem('trackers', JSON.stringify(trackers))
            clearInterval(this.int)
        } else {
            this.setState({ mode: 'pause' })
            trackers.forEach(item=>{
                if(item.name===this.state.name){
                    item.mode='pause'
                }
            })
            localStorage.setItem('trackers', JSON.stringify(trackers))
            clearInterval(this.int)
            this.int = setInterval(() => {
                this.props.change.bind(this, this.state.name)()
            }, 1000);
        }
    }
    componentWillUnmount() {
        clearInterval(this.int)
    }
    delete() {
        this.props.delete(this.props.name)
    }
    render() {
        return (
            <div className={"tracker-item " + this.state.mode}>
                <h3 className="name">{this.props.name}</h3>
                <div className="controllers">
                    <p className="time">{this.props.hours + '.' + this.props.minutes + '.' + this.props.seconds}</p>
                    <Button variant="contained" color="primary" onClick={this.pause}>
                        {this.state.mode}</Button>
                    <Button variant="contained" color="secondary" name={this.props.name} onClick={this.delete.bind(this)}>
                        Delete</Button>
                </div>
            </div>
        )
    }
}

export default Tracker
