import React, {Component} from 'react';
import 'whatwg-fetch';
import moment from 'moment'

const BASE_URL = 'http://localhost:8000/'

// HOC that attaches listeners for window resizing.
// Passes windowWidth and windowHeight as props
let withData = WrappedComponent => {
    
    class dataInjector extends Component {
    
        constructor() {
            super()

            this.fetchServers = this.fetchServers.bind(this)
            this.fetchImpressions = this.fetchImpressions.bind(this) 
            this.fetchPerformance = this.fetchPerformance.bind(this)
            this.fetchPerformancePaginate = this.fetchPerformancePaginate.bind(this)
            this.fetchRequests = this.fetchRequests.bind(this)

            this.state = {
                servers: [],
                impressions: {},
                performance: {},
                performancePage: {}
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

                    return response.data
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

                    return response.data
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

                    return response.data
                })
        }

        fetchPerformancePaginate(dc, server, from) {
         return fetch(`${BASE_URL}performance?dc=${dc}&id=${server}&from=${from}`).then(res => res.json())
            .then(response => {
                this.setState({
                    performancePage: {
                        ...this.state.performancePage,
                        [dc]: {
                            ...this.state.performancePage[dc],
                            [server]: response.data
                        }
                    }
                })

                return response.data
            })       
        }
        
        fetchRequests(dc, server) {
            return fetch(`${BASE_URL}requests?dc=${dc}&id=${server}`).then(res => res.json())
                .then(response => {
                    return response.data
                })
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    fetchImpressions={this.fetchImpressions}
                    fetchServers={this.fetchServers}
                    fetchPerformance={this.fetchPerformance}
                    fetchPerformancePaginate={this.fetchPerformancePaginate}
                    fetchRequests={this.fetchRequests}
                    servers={this.state.servers}
                    impressions={this.state.impressions}
                    performance={this.state.performance} >
                </WrappedComponent>
            );
        }
    }

	return dataInjector
}

export default withData