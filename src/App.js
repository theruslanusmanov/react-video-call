import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Welcome from './pages/welcome/Welcome'
import Meeting from './pages/meeting/Meeting'

function App () {
  return (
    <Router>
      <Switch>
        <Route path="/meeting">
          <Meeting/>
        </Route>
        <Route path="/">
          <Welcome/>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
