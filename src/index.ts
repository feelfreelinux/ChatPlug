import 'reflect-metadata'
import log from 'npmlog'
import { ChatPlug } from './ChatPlug'
import ChatPlugContext from './ChatPlugContext'
import ThreadConnection from './entity/ThreadConnection'
import Thread from './entity/Thread'
import Service from './entity/Service'
import chalk from 'chalk'
import CLICommands from './configWizard/cli/CLICommands'

const argv = require('yargs-parser')(process.argv.slice(2), {
  string: ['addConnection', 'a', 'addThread', 't', 'id', 'i', 'c', 'connection'],
  alias: {
    c: 'connection',
    l: 'listConnections',
    s: 'start',
    a: 'addConnection',
    t: 'addThread',
    i: 'id',
    h: 'help',
    r: 'removeThread',
  },
})

const context = new ChatPlugContext()
context.initializeConnection().then(async () => {
  const chatplug = new ChatPlug(context)
  const cli = new CLICommands(context, chatplug)
  cli.handleArgv(argv)
})
