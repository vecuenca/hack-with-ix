import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, IndexRedirect } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'

import App from 'components/App'
import Data from './containers/Data'
import Servers from 'components/Servers'

// Containers
import ImpressionAnalytics from './containers/ImpressionAnalytics'
import PerformanceAnalytics from './containers/PerformanceAnalytics'

let routes =
  <Router
    history = { createBrowserHistory() }
  >
    <Route path="/" component={App}> 
      
      <IndexRedirect to="/impressions"/>
      <Route path="impressions" component={ImpressionAnalytics}></Route>
      <Route path="performance" component={PerformanceAnalytics}></Route>

    </Route>

  </Router>

render(routes, document.getElementById(`root`))
