
const BASE_URL = 'http://localhost:8000/'

export function fetchServers() {
    return fetch(BASE_URL + 'servers')
        .then(res => res.json())
        .then(response => {
            // this.setState({
            //     servers: response.data
            // })
            return response.data
        })
}

export function fetchImpressions(dc) {
    return fetch(`${BASE_URL}impressions?dc=${dc}`).then(res => res.json())
        .then(response => {
            // this.setState({
            //     impressions: {
            //         ...this.state.impressions,
            //         [dc]: response.data
            //     }
            // })
            return response.data
        })
}

export function fetchPerformance(dc, server) {
    return fetch(`${BASE_URL}performance?dc=${dc}&id=${server}`).then(res => res.json())
        .then(response => {
            // this.setState({
            //     performance: {
            //         ...this.state.performance,
            //         [dc]: {
            //             ...this.state.performance[dc],
            //             [server]: response.data
            //         }
            //     }
            // })
            return response.data
        })
}