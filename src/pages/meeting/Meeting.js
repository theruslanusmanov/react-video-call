import React, { useEffect } from 'react'
import AgoraRTC from 'agora-rtc-sdk'
import './Meeting.scss'

const $ = (selector) => document.querySelectorAll(selector);

const rtc = {
  client: null,
  joined: false,
  published: false,
  localStream: null,
  remoteStreams: [],
  params: {},
}

const options = {
  appID: '818ec1aee6604710974eb1c9a639a76b',
  channel: 'testChannel',
  uid: null,
  token: '006818ec1aee6604710974eb1c9a639a76bIACTRrlnYFbBRDq4c0xG3LJe32pwUVCOSzbZuQPXjMQsL3ZXrgMAAAAAEABEZ8fls9yKXwEAAQCy3Ipf',
}

const Meeting = () => {

  const initClient = () => {
    // Create a client
    rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'h264' })

    // Initialize the client
    rtc.client.init(options.appID, function () {
      console.log('init success')
    }, (err) => {
      console.error(err)
    })
  }

  const joinChannel = () => {
    // Join a channel
    rtc.client.join(options.token, options.channel, options.uid,
      function (uid) {
        console.log(
          'join channel: ' + options.channel + ' success, uid: ' + uid)
        rtc.params.uid = uid
      }, function (err) {
        console.error('client join failed', err)
      })
  }

  const initStream = () => {
    // Create a local stream
    rtc.localStream = AgoraRTC.createStream({
      streamID: rtc.params.uid,
      audio: true,
      video: true,
      screen: false,
    })

    // Initialize the local stream
    rtc.localStream.init(function () {
      console.log('init local stream success')
      // play stream with html element id "local_stream"
      rtc.localStream.play('local_stream')
    }, function (err) {
      console.error('init local stream failed ', err)
    })

    // Publish the local stream
    rtc.client.publish(rtc.localStream, function (err) {
      console.log('publish failed')
      console.error(err)
    })
  }

  const subscribeToStream = () => {
    rtc.client.on('stream-added', function (evt) {
      var remoteStream = evt.stream
      var id = remoteStream.getId()
      if (id !== rtc.params.uid) {
        rtc.client.subscribe(remoteStream, function (err) {
          console.log('stream subscribe failed', err)
        })
      }
      console.log('stream-added remote-uid: ', id)
    })

    rtc.client.on('stream-subscribed', function (evt) {
      var remoteStream = evt.stream
      var id = remoteStream.getId()
      // Add a view for the remote stream.
      addView(id)
      // Play the remote stream.
      remoteStream.play('remote_video_' + id)
      console.log('stream-subscribed remote-uid: ', id)
    })

    rtc.client.on('stream-removed', function (evt) {
      var remoteStream = evt.stream
      var id = remoteStream.getId()
      // Stop playing the remote stream.
      remoteStream.stop('remote_video_' + id)
      // Remove the view of the remote stream.
      removeView(id)
      console.log('stream-removed remote-uid: ', id)
    })
  }

  const leaveChannel = () => {
    // Leave the channel
    rtc.client.leave(function () {
      // Stop playing the local stream
      rtc.localStream.stop()
      // Close the local stream
      rtc.localStream.close()
      // Stop playing the remote streams and remove the views
      while (rtc.remoteStreams.length > 0) {
        var stream = rtc.remoteStreams.shift()
        var id = stream.getId()
        stream.stop()
        removeView(id)
      }
      console.log('client leaves channel success')
    }, function (err) {
      console.log('channel leave failed')
      console.error(err)
    })
  }

  const addView = (id, show) => {
    if (!$('#' + id)[0]) {
      $('<div/>', {
        id: 'remote_video_panel_' + id,
        class: 'video-view',
      }).appendTo('#video')

      $('<div/>', {
        id: 'remote_video_' + id,
        class: 'video-placeholder',
      }).appendTo('#remote_video_panel_' + id)

      $('<div/>', {
        id: 'remote_video_info_' + id,
        class: 'video-profile ' + (show ? '' : 'hide'),
      }).appendTo('#remote_video_panel_' + id)

      $('<div/>', {
        id: 'video_autoplay_' + id,
        class: 'autoplay-fallback hide',
      }).appendTo('#remote_video_panel_' + id)
    }
  }

  const removeView = (id) => {
    if ($('#remote_video_panel_' + id)[0]) {
      $('#remote_video_panel_' + id).remove()
    }
  }

  useEffect(() => {
    initClient()
    joinChannel()
    initStream()
    subscribeToStream()
  }, [])

  return (
    <div className="meeting">
      <div className="video-grid" id="video">
        <div className="video-view">
          <div id="local_stream" className="video-placeholder"/>
          <div id="local_video_info" className="video-profile float-title hide">Room #{ options.channel }</div>
          <div id="video_autoplay_local"
               className="autoplay-fallback hide"/>
        </div>
        <div className="video-grid-panel">
          <div className="video-view--small">
            <div id="local_stream" className="video-placeholder"/>
            <div id="local_video_info" className="video-profile float-title hide">Room #{ options.channel }</div>
            <div id="video_autoplay_local"
                 className="autoplay-fallback hide"/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Meeting
