import React, { useEffect, useState } from 'react'
import './Meeting.scss'
import RTC from '../../agora/RTC'
import Streams from '../../agora/Streams'
import StreamEvents from '../../agora/StreamEvents'

const $ = (selector: string) => document.querySelectorAll(selector)

const Meeting = () => {
  const [channelName, setChannelName] = useState('')

  const streamInit = (uid: string) => {
    const config = {
      screen: true,
      video: false,
      audio: false,
      extensionId: "minllpmhdgpndnkomcoccfekfegnlikg",
    };
    let defaultConfig = {
      streamID: uid,
      audio: true,
      video: true,
      screen: false
    };

    return AgoraRTC.createStream({...defaultConfig, ...config});
  }

  useEffect(() => {
    const rtc = new RTC()
    setChannelName(rtc.channel)

    const streams = new Streams()
    const streamEvents = new StreamEvents(rtc, streams)

    streamEvents.init()

    rtc.clientInit().then(uid => {
      streams.localStream = streamInit(uid);
      streams.localStream.init(
        () => {
          streams.addStream(streams.localStream);
          rtc.client.publish(streams.localStream, (err: any) => {
            console.log("Publish local stream error: " + err);
          });
        },
        (err: any) => {
          console.log("getUserMedia failed", err);
        }
      );
    })
  }, [])

  return (
    <div className="meeting">
      <div className="title">Room <span>#{channelName}</span></div>
      <div className="video-grid" id="video">
        <div className="video-view">
          <div id="local_stream" className="video-placeholder"/>
          <div id="local_video_info"
               className="video-profile float-title hide">ID #id
            <span>YOU</span></div>
          <div id="video_autoplay_local"
               className="autoplay-fallback hide"/>
        </div>
        <div className="video-grid-panel" id="video-grid-panel">
          <div className="video-view--small">
            <div id="local_stream" className="video-placeholder"/>
            <div id="local_video_info"
                 className="video-profile float-title hide">
              ID #id
            </div>
            <div id="video_autoplay_local"
                 className="autoplay-fallback hide"/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Meeting
