import { Subject } from 'rxjs'
import { ChatPlugService } from './services/Service'
import Service from './entity/Service'
import Message from './entity/Message'
import Thread from './entity/Thread'

export interface IChatPlugMessage {
  message: string
  attachments: IChatPlugAttachement[]
  author: IChatPlugUser
  externalOriginId: string
  externalTargetId: string
  externalOriginName: string | null
  originServiceId: number | null
}

export interface IChatPlugAttachement {
  type: IChatPlugAttachementType,
  url: string
  name: string
}

export interface MessagePacket {
  message: Message
  targetThread: Thread
}

export enum IChatPlugAttachementType {
  VIDEO = 'video',
  GIF = 'gif',
  IMAGE = 'image',
  AUDIO = 'audio',
  FILE = 'file',
}

export enum IChatPlugServiceStatus {
  STARTING = 'starting',
  RUNNING = 'running',
  CRASHED = 'crashed',
  TERMINATING = 'terminating',
  SHUTDOWN = 'shutdown',
}

export interface IChatPlugServiceStatusUpdate {
  serviceId: number,
  statusUpdate: IChatPlugServiceStatus,
}

export interface IChatPlugService {
  messageSubject: Subject<IChatPlugMessage>
}

export interface IChatPlugThread {
  id: string
  service: string
  name: string
}

export interface IChatPlugThreadResult {
  id: string
  title: string
  subtitle: string | null
  avatarUrl: string | null
}

export interface IChatPlugUser {
  username: string
  avatar?: string
  externalServiceId: string
}

export interface IChatPlugConnection {
  services: IChatPlugThread[]
}

export interface IChatPlugServiceConfig {
  enabled: boolean
}
