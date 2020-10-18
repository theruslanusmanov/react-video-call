// @ts-ignore
import AgoraRTC from 'agora-rtc-sdk'

class RTC {

  public client: any
  public channel: string

  public readonly SHARE_ID = 1

  private readonly config: any

  private appID: string
  private token: string
  private uid: any

  constructor () {
    this.channel = 'testChannel'

    this.appID = '818ec1aee6604710974eb1c9a639a76b'
    this.token = '006818ec1aee6604710974eb1c9a639a76bIACSSYqAXQ/lNTE+WeDa37cIzUtP5HyKBCZm+EDvEb5RC3ZXrgMAAAAAEAA1HXOdyZKNXwEAAQDIko1f'
    this.uid = undefined

    this.config = {
      mode: 'rtc',
      codec: 'h264',
    }

    // @ts-ignore
    this.client = AgoraRTC.createClient(this.config)
  }

  clientInit (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.init(this.appID, () => {
        console.log('AgoraRTC client initialized')

        // Join the channel
        this.client.join(
          this.token,
          this.channel,
          this.uid,
          (uid: string) => {
            console.log(`User ${uid} join channel successfully`)

            // Create local stream
            resolve(uid)
          },
          (err: any) => {
            reject(err)
          },
        )
      })
    })
  }
}

export default RTC
