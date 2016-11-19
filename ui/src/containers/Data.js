
import React, {Component} from 'react';
import 'whatwg-fetch';
import moment from 'moment'

const BASE_URL = 'http://localhost:8000/'

class Data extends Component {
    
    constructor() {
        super()

        this.fetchServers = this.fetchServers.bind(this)
        this.fetchImpressions = this.fetchImpressions.bind(this) 
        this.fetchPerformance = this.fetchPerformance.bind(this)


        this.state = {
            servers: [],
            impressions: {},
            performance: {}
        }
    }

    componentDidMount() {
        Promise.all([
            this.fetchServers()
        ]).then(res => {
        })
    }

    fetchServers() {
        return fetch(BASE_URL + 'servers')
            .then(res => res.json())
            .then(response => {
                this.setState({
                    servers: response.data
                })
            })
    }

    fetchImpressions(dc) {
        return fetch(`${BASE_URL}impressions?dc=${dc}`).then(res => res.json())
            .then(response => {
                this.setState({
                    impressions: {
                        ...this.state.impressions,
                        [dc]: response.data
                    }
                })
            })
    }

    fetchPerformance(dc, server) {
        return fetch(`${BASE_URL}performance?dc=${dc}&id=${server}`).then(res => res.json())
            .then(response => {
                this.setState({
                    performance: {
                        ...this.state.performance,
                        [dc]: {
                            ...this.state.performance[dc],
                            [server]: response.data
                        }
                    }
                })
            })
    }
    
    render() {
        return (
            <div>
                {
                    React.cloneElement(this.props.children, {
                        fetchImpressions: this.fetchImpressions,
                        fetchServers: this.fetchServers,
                        fetchPerformance: this.fetchPerformance,
                        servers: this.state.servers,
                        impressions: this.state.impressions,
                        performance: this.state.performance
                    },
                    this.props.children.props.children)
                }
            </div>
        );
    }
}

export default Data;