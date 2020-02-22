import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

export class Tracker extends Component {
    constructor(props) {
        super(props)
        this.pause = this.pause.bind(this);
        this.delete=this.delete.bind(this)
    }

    componentDidMount() {
        if (this.props.mode === 'pause') {
            this.int = setInterval(() => {
                this.props.change.bind(this, this.props.name)()
            }, 1000);
        } else {
            clearInterval(this.int)
        }
    }
    
    // Changing tracker mode
    pause() {
        const trackers = JSON.parse(localStorage.getItem('trackers'));
        if (this.props.mode === 'pause') {
            trackers.forEach(item => {
                if (item.name === this.props.name) {
                    item.mode = 'play'
                }
            })
            this.props.pause.bind(this, trackers)()
            clearInterval(this.int)
        } else if (this.props.mode === 'play') {
            trackers.forEach(item => {
                if (item.name === this.props.name) {
                    item.mode = 'pause'
                }
            })
            this.props.pause.bind(this, trackers)()
            this.int = setInterval(() => {
                this.props.change.bind(this, this.props.name)()
            }, 1000);
        }
    }
    componentWillUnmount(){
        clearInterval(this.int)
    }

    //Calling function in parent component, which deletes tracker
    delete() {
        this.props.delete(this.props.name)
    }
    render() {
        return (
            <div className={"tracker-item " + this.props.mode}>
                <h3 className="name">{this.props.name}</h3>
                <div className="controllers">
                    <p className="time">{this.props.hours + '.' + this.props.minutes + '.' + this.props.seconds}</p>
                    <Button variant="contained" color="primary" onClick={this.pause}>
                        {this.props.mode}</Button>
                    <Button variant="contained" color="secondary" name={this.props.name} onClick={this.delete}>
                        Delete</Button>
                </div>
            </div>
        )
    }
}

export default Tracker
