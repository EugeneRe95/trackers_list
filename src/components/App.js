import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import 'moment-precise-range-plugin'
import moment from 'moment'
import FlipMove from 'react-flip-move'

import Tracker from './Tracker';

import '../styles/App.css';

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            trackers: [],
            newTracker: '',
            error: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.addTracker = this.addTracker.bind(this)
        this.interval = this.interval.bind(this)
    }
    componentDidMount() {
        const trackers = JSON.parse(localStorage.getItem('trackers'))
        if (localStorage.getItem('unloadTime') !== null && trackers !== null) {
            const now = new Date();
            const diff = moment.preciseDiff(now, localStorage.getItem('unloadTime'), true);
            trackers.forEach(item => {
                if (item.mode === 'pause') {
                    item.hours = item.hours + diff.hours + diff.days * 24 + diff.months * 730 + diff.years * 730 * 12
                    item.minutes = item.minutes + diff.minutes
                    item.seconds = item.seconds + diff.seconds
                    let b = item.seconds + diff.seconds
                    let a = item.minutes + diff.minutes
                    if (a > 60) {
                        item.hours = item.hours + Math.floor(a / 60)
                        item.minutes = a - Math.floor(a / 60) * 60
                    }
                    if (b > 60) {
                        item.minutes = item.minutes + Math.floor(b / 60)
                        item.seconds = b - Math.floor(b / 60) * 60
                        if (item.minutes > 60) {
                            item.hours = item.hours + Math.floor(item.minutes / 60)
                            item.minutes = item.minutes - Math.floor(item.minutes / 60) * 60
                        }
                    }
                }
            })
            localStorage.setItem('trackers', JSON.stringify(trackers))
        }
        this.setState({ trackers: (trackers !== null) ? trackers : [] })

        window.addEventListener('beforeunload', () => {
            const now = new Date()
            localStorage.setItem('unloadTime', now)
        })
    }
    handleChange(e) {
        this.setState({ newTracker: e.target.value })
    }
    add(trackers) {
        if (this.state.newTracker !== '') {
            const tracker = {
                name: this.state.newTracker,
                hours: 0,
                minutes: 0,
                seconds: 0,
                mode: 'pause'
            }
            const newTrackers = trackers.concat(tracker);
            this.setState({ trackers: newTrackers }, () => {
                localStorage.setItem('trackers', JSON.stringify(newTrackers))
            })
        } else {
            const tracker = {
                name: Date().substring(0, Date().indexOf('GMT')),
                hours: 0,
                minutes: 0,
                seconds: 0,
                mode: 'pause'
            }
            const newTrackers = trackers.concat(tracker);
            this.setState({ trackers: newTrackers }, () => {
                localStorage.setItem('trackers', JSON.stringify(newTrackers))
            })
        }
    }
    addTracker() {
        const trackers = JSON.parse(localStorage.getItem('trackers'));

        if (trackers !== null) {
            if (trackers.length > 0) {
                let error = []
                trackers.forEach(item => {
                    if (item.name === this.state.newTracker) {
                        error.push(true)
                    } else {
                        error.push(false)
                    }
                })
                if (error.includes(true)) {
                    this.setState({ error: 'show' })
                } else {
                    this.setState({ error: '' }, () => {
                        this.add(trackers);
                    })
                }
            } else {
                this.add(this.state.trackers)
            }
        } else {
            this.add(this.state.trackers)
        }
    }
    pressEnter(e) {
        if (e.keyCode === 13) {
            this.addTracker();
        }
    }
    delete(name) {
        if (name === this.state.newTracker) {
            this.setState({ error: '' })
        }
        const newTrackers = [];
        this.state.trackers.forEach(item => {
            if (item.name !== name) {
                newTrackers.push(item)
            }
        })
        this.setState({
            trackers: newTrackers
        }, () => {
            localStorage.setItem('trackers', JSON.stringify(this.state.trackers))
        })
    }
    interval(name) {
        const trackers = JSON.parse(localStorage.getItem('trackers'));
        trackers.forEach(item => {
            if (item.name === name) {
                if (item.seconds < 59) {
                    item.seconds = item.seconds + 1;
                } else if (item.seconds === 59) {
                    item.seconds = 0;
                    item.minutes = item.minutes + 1;
                } else if (item.minutes === 59) {
                    item.minutes = 0;
                    item.hours = item.hours + 1;
                }
            }
        })
        this.setState({ trackers: trackers }, () => {
            localStorage.setItem('trackers', JSON.stringify(trackers))
        })
    }
    render() {
        return (
            <main>
                <div className="container">
                    <h1>Tracker</h1>
                    <div className="add-tracker">
                        <TextField id="input" label="Enter tracker name" variant="filled" size="small" vlaue={this.state.newTracker} onChange={this.handleChange} onKeyUp={this.pressEnter.bind(this)} />
                        <Button variant="contained" color="primary" onClick={this.addTracker}>
                            Add</Button>
                    </div>
                    {(this.state.error !== '') ? <h3 className="message">Таймер с этим именем уже существует</h3> : null}
                    <FlipMove id="trackers">
                        {this.state.trackers.map((item, index) => {
                            return <Tracker key={index} name={item.name} hours={item.hours} minutes={item.minutes} seconds={item.seconds} mode={item.mode} delete={this.delete.bind(this)} change={this.interval} />
                        })}
                    </FlipMove>
                </div>
            </main>
        );
    }
}

export default App;