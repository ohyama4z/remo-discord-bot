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

  type Commands = `エアコン` | `扇風機` | `--help` | `ヘルプ`
  const [, command, ...args] = message.content.split(` `) as [undefined, Commands, ...(string | undefined)[]]
  
  if (command === `エアコン`) {
    message.channel.send(command)
    return
  }

  if (command === `扇風機`) {
    message.channel.send(command)
    return
  }

  if (command === `--help` || command === `ヘルプ`) {
    const text =
      `
      !remo <コマンド> ...引数

      使い方:
        !remo エアコン   :エアコンに関する操作を行います
        !remo 扇風機     :扇風機に関する操作を行います
        !remo ヘルプ
        !remo --help     :このヘルプを表示します
      `

    message.channel.send(text)
    return
  }

  message.channel.send(`${command}: こんなコマンドはない`)
})

client.login(process.env.DISCORD_TOKEN)