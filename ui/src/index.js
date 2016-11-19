import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'

import App from 'components/App'
import Data from './containers/Data'
import Servers from 'components/Servers'

// Containers
import ImpressionAnalytics from './containers/ImpressionAnalytics'
import ServerAnalytics from './containers/ServerAnalytics'

let routes =
  <Router
    history = { createBrowserHistory() }
  >
    <Route path="/" component={Data}> 
      
      <IndexRoute component={App} />
      <Route
        path = "servers"
        component = { Servers }
      />
      <Route path="impressions" component={ImpressionAnalytics}></Route>
      <Route path="server" component={ServerAnalytics}></Route>

    </Route>

  </Router>

render(routes, document.getElementById(`root`))
