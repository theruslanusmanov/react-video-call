// @ts-ignore
import AgoraRTC from 'agora-rtc-sdk'

class RTC {

  public client: any

  public readonly SHARE_ID = 1

  private readonly config: any

  private appID: string
  private channel: string
  private token: string

  constructor () {
    this.appID = '818ec1aee6604710974eb1c9a639a76b'
    this.channel = 'testChannel'
    this.token = '006818ec1aee6604710974eb1c9a639a76bIACTRrlnYFbBRDq4c0xG3LJe32pwUVCOSzbZuQPXjMQsL3ZXrgMAAAAAEABEZ8fls9yKXwEAAQCy3Ipf'

    this.config = {
      mode: 'rtc',
      codec: 'h264',
    }

    // @ts-ignore
    this.client = AgoraRTC.createClient(this.config)
  }
}

export default RTC
