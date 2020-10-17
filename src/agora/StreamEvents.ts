// @ts-ignore
import Streams from './Streams'
import RTC from './RTC'

enum StreamEventType {
  STREAM_ADDED = 'stream-added',
  STREAM_SUBSCRIBED = 'stream-subscribed',
  STREAM_REMOVED = 'stream-removed',
  PEER_LEAVE = 'peer-leave'
}

class StreamEvents {

  private rtc: RTC
  private streams: Streams

  constructor (rtc: RTC, streams: Streams) {
    this.rtc = rtc
    this.streams = streams
  }

  init (): void {
    this.onStreamAdded()
    this.onStreamSubscribed()
    this.onStreamRemoved()
    this.onPeerLeave()
  }

  onStreamAdded (): void {
    this.rtc.client.on(StreamEventType.STREAM_ADDED, (event: any) => {
      const stream = event.stream
      const streamId = stream.getId()

      if (streamId === this.rtc.SHARE_ID) {
        this.streams.mainStream = stream
      }

      this.rtc.client.subscribe(stream, function (err: any) {
        console.log('Subscribe stream failed', err)
      })
    })
  }

  onStreamSubscribed (): void {
    this.rtc.client.on(StreamEventType.STREAM_SUBSCRIBED, (event: any) => {
      const stream = event.stream
      console.log('Got stream-subscribed event')
      console.log('Subscribe remote stream successfully: ' + stream.getId())
      this.streams.addStream(stream)
    })
  }

  onStreamRemoved (): void {
    this.rtc.client.on(StreamEventType.STREAM_REMOVED, (event: any) => {
      const stream = event.stream
      const streamId = stream.getId()
      console.log('Stream removed: ' + streamId)
      stream.removeStream(streamId)
    })
  }

  onPeerLeave (): void {
    this.rtc.client.on(StreamEventType.PEER_LEAVE, (event: any) => {
      let uid = event.uid
      console.log('Peer has left: ' + uid)
      this.streams.removeStream(event.uid)
    })
  }
}

export default StreamEvents
