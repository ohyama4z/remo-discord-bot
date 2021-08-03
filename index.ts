require('dotenv').config()

import { Client } from 'discord.js'
import remo, { AirconSettingData } from './remo'

const client = new Client()

client.once(`ready`, () => {
  console.log(`準備完了`)
})

client.on(`message`, async message => {
  if (!message.content.startsWith(`!remo`) || message.author.bot) {
    return
  }

  type Commands = `エアコン` | `ac` | `help` | `ヘルプ`
  const [, command, ...args] = message.content.split(` `) as [undefined, Commands, ...(string | undefined)[]]
  
  if (command === `エアコン` || command === `ac`) {
    const settingPram: AirconSettingData = {
      button: `on`,
      temp: null,
      mode: null
    }

    if (args == null) {
      try {
        remo.aircon.setStatus(settingPram)
      } catch (e) {
        console.log(e)
        message.channel.send(e)
      }
      message.channel.send(`送信に成功しました`)
      return
    }

    const helpText =
    `
    \`\`\`!remo エアコン <サブコマンド> ...オプション

    #サブコマンド
      on          :エアコンの電源をオンにします
      (サブコマンドを入力しない場合でもデフォルトでエアコンをオンにします)
      off         :エアコンの電源をオフにします
      status      :現在のエアコンの設定を表示します
      help        :このヘルプを表示します

    #オプション
      --temp, -t  :エアコンの設定温度を変更します
      設定値範囲 ["21","22","23","24","25","26","27","28","29"]
      ex) !remo エアコン -t 24 (エアコンを24℃に設定)

      --mode -m   :エアコンの動作モードを変更します
      設定値範囲 ["強風","弱風","除湿","送風"]
      ex) !remo エアコン -m 強風 (エアコンを強風モードに設定)

    #エイリアス
      エアコン, ac\`\`\`
    `
    if (args[0] === `help`) {
      message.channel.send(helpText)
      return
    }

    if (args[0] === `status`) {
      const status = await remo.aircon.getStatus()
      message.channel.send(JSON.stringify(status))
      return
    }

    if (args[0] === `off`) {
      settingPram.button = `off`
    }

    const options = (args[0] === `on` || args[0] === `off`) ? args.slice(1) : args.slice(0)
    let optionPairs: [string|undefined, string|undefined][] = []
    for (let i = 0; i < options.length; i += 2) {
      optionPairs = [...optionPairs, options.slice(i, i+2) as [string|undefined, string|undefined]];
    }

    for (let optionPair of optionPairs) {
      if (optionPair[0] === `--temp` || optionPair[0] === `-t`) {
        const tempRange = [`21`, `22`, `23`, `24`, `25`, `26`, `27`, `28`, `29`]
        if (optionPair[1] == null || !tempRange.includes(optionPair[1])) {
          message.channel.send(`${optionPair[0]} ${optionPair[1]}: オプションの値が不正です。ヘルプを確認してください`)
          message.channel.send(helpText)
          return
        }
        
        settingPram.temp = optionPair[1] as AirconSettingData["temp"]
        continue
      }

      if (optionPair[0] === `--mode` || optionPair[0] === `-m`) {
        const modeRange = [`強風`,`弱風`,`除湿`,`送風`]
        if (optionPair[1] == null || !modeRange.includes(optionPair[1])) {
          message.channel.send(`${optionPair[0]} ${optionPair[1]}: オプションの値が不正です。ヘルプを確認してください`)
          message.channel.send(helpText)
          return
        }
        
        settingPram.mode = optionPair[1] as AirconSettingData["mode"]
        continue
      }

      if (optionPair[0] != null) {
        message.channel.send(`${optionPair[0]} ${optionPair[1]}: オプションの値が不正です。ヘルプを確認してください`)
        message.channel.send(helpText)
        return
      }
    }
    
    try {
      remo.aircon.setStatus(settingPram)
    } catch (e) {
      console.log(e)
      message.channel.send(e)
    }
    console.log(settingPram)
    message.channel.send(`送信に成功しました`)
    return
  }

  if (command !== `help` && command !== `ヘルプ`) {
    message.channel.send(`${command}: コマンドが不正です`)
  }
  
  const helpText =
    `
    \`\`\`!remo <コマンド> ...引数

    #使い方
      !remo エアコン   :エアコンに関する操作を行います
      !remo help     :このヘルプを表示します\`\`\`
    `
  message.channel.send(helpText)
})

client.login(process.env.DISCORD_TOKEN)