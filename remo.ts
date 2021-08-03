require('dotenv').config()

import axiosBase from "axios"

const axios = axiosBase.create({
  baseURL: `https://api.nature.global`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.NATURE_REMO_TOKEN}`
  }
})

export interface AirconSettingData {
  button: `on` | `off`,
  temp: `21` | `22` | `23` | `24` | `25` | `26` | `27` | `28` | `29` | null,
  mode: `強風` | `弱風` | `除湿` | `送風` | null
}

interface Aircon {
  id: string,
  image: string
  nickname: string,
  setStatus: (data:AirconSettingData) => Promise<void>,
  getStatus: () => Promise<AirconSettingData>
}

const aircon: Readonly<Aircon> = {
  id: `b0812da1-ea09-4c8b-8d61-6784b1f395f7`,
  image: `ico_ac_1`,
  nickname: `エアコン`,

  setStatus: async function(data) {
    let param = ``
    if (data.button === `off`) {
      param = `button=power-off&`
    }
  
    if (data.temp != null) {
      param = `${param}temperature=${data.temp}&`
    }
  
    if (data.mode != null) {
      switch (data.mode) {
        case `強風`:
          param = `${param}operation_mode=cool&air_volume=2`
          break;
        
        case `弱風`:
          param = `${param}operation_mode=cool&air_volume=1`
          break;
      
        case `除湿`:
          param = `${param}operation_mode=dry`
          break
  
        default:
          param = `${param}operation_mode=blow`
          break;
      }
    }
  
    const res = await axios.post(`/1/appliances/${this.id}/aircon_settings?${param}`)
  
    console.log(res.data)
  },

  getStatus: async function () {
    const encodedNickname = encodeURI(this.nickname)
    const param = `nickname=${encodedNickname}`
    const res = await axios.post(`/1/appliances/${this.id}?${param}`)
    const resMode = res.data.settings.mode as (`cool` | `dry` | `blow`)
    let mode = `` as (`弱風` | `強風` | `除湿` | `送風`)
    if (resMode === `cool`) {
      if (res.data.settings.vol === `1`) {
        mode = `弱風`
      }
      mode = `強風`
    } else if (resMode === `dry`) {
      mode = `除湿`
    } else {
      mode = `送風`
    }

    const settingData: AirconSettingData = {
      button: res.data.settings.button === `power-off` ? `off` : `on`,
      temp: res.data.settings.temp,
      mode
    }

    return settingData
  }
}

export default {aircon}