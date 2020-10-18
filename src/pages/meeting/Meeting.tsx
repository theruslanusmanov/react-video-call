import React, { useEffect, useState } from 'react'
import './Meeting.scss'
import RTC from '../../agora/RTC'
import Streams from '../../agora/Streams'
// @ts-ignore
import AgoraRTC from 'agora-rtc-sdk'
import StreamEventType from '../../agora/StreamEventType'

const Meeting = () => {
  const [channelName, setChannelName] = useState('')

  const streamInit = (uid: string) => {
    let defaultConfig = {
      streamID: uid,
      audio: true,
      video: true,
      screen: false
    };
    const config = {
      screen: false,
      video: true,
      audio: false,
    };

    return AgoraRTC.createStream({...defaultConfig, ...config});
  }

  function addStreamsToUI(streams: any[]) {
    streams.forEach((stream, index) => {
      const streamId = stream.getId();
      let dom = document.querySelector("#video-item-" + streamId);
      if (!dom) {
        dom = document.createElement("div");
        const viewContainer = document.getElementById('video-grid-panel');
        viewContainer?.appendChild(dom)
        dom.outerHTML = `
          <div class="video-view--small">
            <div class="video-placeholder" id="video-item-${streamId}"/>
            <div id="local_video_info"
                 class="video-profile float-title hide">
              ID #${streamId}
            </div>
          </div>
        `
        // document.body.appendChild(dom);
        stream.play("video-item-" + streamId);
      }
    })
  }

  function removeStreamsFromUI(streams: any[], id: string) {
    streams.map((item, index) => {
      console.log(item);
      if (item.getId() === id) {
        console.log('remove' + id);
        streams[index].close();
        const video = document.getElementById(`video-item-${id}`);
        console.log('VIDEo');
        console.log(video);
        video?.remove();
        streams.splice(index, 1);
        return 1;
      }
      return 0;
    });
  }

  useEffect(() => {
    const rtc = new RTC()
    setChannelName(rtc.channel)

    const streams = new Streams()

    rtc.client.on(StreamEventType.STREAM_ADDED, (event: any) => {
      const stream = event.stream
      const streamId = stream.getId()

      if (streamId === rtc.SHARE_ID) {
        streams.mainStream = stream
      }

      rtc.client.subscribe(stream, function (err: any) {
        console.log('Subscribe stream failed', err)
      })
    })

    rtc.client.on(StreamEventType.STREAM_SUBSCRIBED, (event: any) => {
      const stream = event.stream
      console.log('Got stream-subscribed event')
      console.log('Subscribe remote stream successfully: ' + stream.getId())
      streams.addStream(stream)
      addStreamsToUI(streams.list);
    })

    rtc.client.on(StreamEventType.STREAM_REMOVED, (event: any) => {
      const stream = event.stream
      const streamId = stream.getId()
      console.log('Stream removed: ' + streamId)
      removeStreamsFromUI(streams.list, streamId)
      stream.removeStream(streamId)
    })

    rtc.client.on(StreamEventType.PEER_LEAVE, (event: any) => {
      let uid = event.uid
      const stream = event.stream
      const streamId = stream.getId()
      console.log('Peer has left: ' + uid)
      removeStreamsFromUI(streams.list, streamId)
      streams.removeStream(event.uid)
      console.log(streams.list);
    })

    rtc.clientInit().then(uid => {
      streams.localStream = streamInit(uid);
      streams.localStream.init(
        () => {
          streams.addStream(streams.localStream);
          addStreamsToUI(streams.list)
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
       {/* <div className="video-view">
          <div id="local_stream" className="video-placeholder"/>
          <div id="local_video_info"
               className="video-profile float-title hide">ID #id
            <span>YOU</span></div>
          <div id="video_autoplay_local"
               className="autoplay-fallback hide"/>
        </div>*/}
        <div className="video-grid-panel" id="video-grid-panel">
          {/*<div className="video-view--small">
            <div id="local_stream" className="video-placeholder"/>
            <div id="local_video_info"
                 className="video-profile float-title hide">
              ID #id
            </div>
            <div id="video_autoplay_local"
                 className="autoplay-fallback hide"/>
          </div>*/}
        </div>
      </div>
    </div>
  )
}

export default Meeting
