import React, { useEffect } from 'react'
import './Meeting.scss'
import RTC from '../../agora/RTC'
import Streams from '../../agora/Streams'
import StreamEvents from '../../agora/StreamEvents'

const $ = (selector: string) => document.querySelectorAll(selector)

const Meeting = () => {

  useEffect(() => {
    const rtc = new RTC()
    const streams = new Streams();
    const streamEvents = new StreamEvents(rtc, streams);

    streamEvents.init();
  }, [])

  return (
    <div className="meeting">
      <div className="title">Room <span>#channelName</span></div>
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
