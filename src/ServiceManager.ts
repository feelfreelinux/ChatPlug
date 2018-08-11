import log from 'npmlog'
import { ChatPlugService } from './services/Service'
import ChatPlugContext from './ChatPlugContext'
import Service from './entity/Service'
import path from 'path'
import fs from 'fs-extra'

export interface ServiceMap {
  [id: number]: ChatPlugService
}

export class ServiceManager {
  services: ServiceMap
  context: ChatPlugContext
  constructor(context: ChatPlugContext) {
    this.context = context
    this.services = {}
  }

  async getAvailableServices() {
    const servicesPath = path.join(__dirname, 'services')
    const allFiles = await fs.readdir(servicesPath)
    const directories: string[] = []
    for (const f of allFiles) {
      if ((await fs.stat(path.join(servicesPath, f))).isDirectory()) {
        directories.push(f)
      }
    }
    return directories
  }
  getServiceForId(id: string): ChatPlugService {
    return this.services[id]
  }

  getRegisteredServices(): ChatPlugService[] {
    return Object.keys(this.services).map(k => this.services[k])
  }

  async loadServices() {
    const repo = this.context.connection.getRepository(Service)
    const services = await repo.find({ enabled: true })
    for (const service of services) {
      this.services[service.id] = new (require(path.join(
        __dirname,
        'services',
        service.moduleName,
      ) as any)).Service(service, this.context)
    }
  }

  async initiateServices() {
    this.getRegisteredServices().forEach(service => {
      log.info(
        'services',
        `Service instance ${service.dbService.instanceName} (${
          service.dbService.moduleName
        }) enabled, initializing...`,
      )
      service.initialize()
    })
  }

  async terminateServices() {
    return Promise.all(
      this.getRegisteredServices().map(
        async service => await service.terminate(),
      ),
    )
  }
}
