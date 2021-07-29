require('dotenv').config()

import { Client } from 'discord.js'

const client = new Client()

client.once(`ready`, () => {
  console.log(`準備完了`)
})

client.on(`message`, message => {
  if (!message.content.startsWith(`!remo`) || message.author.bot) {
    return
  }

  type Commands = `エアコン` | `ac` | `扇風機` | `fan` | `--help`
  const [, command, ...args] = message.content.split(` `) as [undefined, Commands, ...(string | undefined)[]]
  
  if (command === `エアコン` || command === `ac`) {
    message.channel.send(`!remo ${command}: 未実装です...もうちょい待ってて...`)
    return
  }

  if (command === `扇風機` || command === `fan`) {
    message.channel.send(`!remo ${command}: 未実装です...もうちょい待ってて...`)
    return
  }

  if (command !== `--help`) {
    message.channel.send(`${command}: こんなコマンドはない`)
  }
  
  const helpText =
    `
    !remo <コマンド> ...引数

    使い方:
      !remo エアコン   :エアコンに関する操作を行います
      !remo 扇風機     :扇風機に関する操作を行います
      !remo --help     :このヘルプを表示します
    `
  message.channel.send(helpText)
})

client.login(process.env.DISCORD_TOKEN)