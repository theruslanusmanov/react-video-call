import React, {useEffect} from 'react'
import logo from './logo.svg'
import './App.css'
import AgoraRTC from 'agora-rtc-sdk'

// rtc object
var rtc = {
  client: null,
  joined: false,
  published: false,
  localStream: null,
  remoteStreams: [],
  params: {},
}

// Options for joining a channel
var option = {
  appID: '818ec1aee6604710974eb1c9a639a76b',
  channel: 'test-channel',
  uid: null,
  token: '006818ec1aee6604710974eb1c9a639a76bIACzVBbIZPz3CUPWIIK+SQisroEIkSq5zXYae1HUh8vxm2LMzZAAAAAAEABEZ8flL9CKXwEAAQAv0Ipf',
}

function App () {

  useEffect(() => {
    // Create a client
    rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'h264' })

    // Initialize the client
    rtc.client.init(option.appID, function () {
      console.log('init success')
    }, (err) => {
      console.error(err)
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div id="video"></div>
    </div>
  )
}

export default App
