import log from 'npmlog'
import { IFacegramMessage } from '../../models'
import { FacegramService } from '../Service'
import { Subject } from 'rxjs'
import { FacebookConfig } from './FacebookConfig'
import facebook from 'facebook-chat-api'
import { createInterface } from 'readline'
import { ExchangeManager } from '../../ExchangeManager'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

export class FacebookService implements FacegramService {
  isEnabled: boolean
  name = 'facebook'
  messageSubject: Subject<IFacegramMessage>
  receiveMessageSubject: Subject<IFacegramMessage> = new Subject()
  config: FacebookConfig
  facebook: any

  constructor (config: FacebookConfig, exchangeManager: ExchangeManager) {
    this.messageSubject = exchangeManager.messageSubject
    this.config = config
    this.isEnabled = config.enabled
  }

  initialize () {
    return new Promise((resolve, reject) => {
      facebook({
        email: this.config.email,
        password: this.config.password
      }, {
        forceLogin: this.config.forceLogin,
        logLevel: process.env.NODE_ENV === 'development' ? 'info' : 'warn'
      }, async (err, api) => {
        if (err) {
          if (err.error !== 'login-approval') return reject(err)
          log.info('facebook', 'Login approval pending...')
          let code = await new Promise(result => rl.question('Enter login approval code to your Facebook account (SMS or Google Authenticator app): ', result))
          err.continue(code)
        }
        this.facebook = api
        log.info('facebook', 'Logged in as', this.config.email)
        resolve()
      })
    })
  }
}
