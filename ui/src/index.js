import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'

import App from 'components/App'
import Data from './containers/Data'
import Servers from 'components/Servers'

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

    </Route>

  </Router>

render(routes, document.getElementById(`root`))
